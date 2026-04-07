import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faArrowLeft, faPaperclip, faFileLines, faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import InfoTracking from "../pages/InfoTracking";
import { faSpinner } from "@fortawesome/free-solid-svg-icons/faSpinner";
import { apiUrl } from "../config/api";

// --- INTERFACES ---
interface Message {
  id: number;
  idSignalement: number;
  userId: string | null;
  contenu: string;
  isRead: boolean;
  createdAt: string;
  user?: {
    name: string;
    surname: string;
    role: {
      nameRole: string
    };
  } | null;
}

interface ChatBoxProps {
  messages: Message[];
  idSignalement: number;
  onRefresh: () => void;
  onClose?: () => void;
  trackingCode: string; 
  password: string;
}

interface Attachment {
  id: number;
  url: string;
  createdAt: string;
  fileSize?: string;
}

// ... (Interfaces Message, ChatBoxProps, Attachment identiques)

export default function ChatBox({ messages, idSignalement, onRefresh, trackingCode, password }: ChatBoxProps) {
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [refreshing, setRefreshing] = useState(false); // État pour l'animation
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const { id } = useParams<{ id: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const fetchFiles = async () => {
    try {
      const response = await fetch(apiUrl("/api/signalements/file"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idSignalement }),
      });
      const result = await response.json();
      if (result.data) setAttachments(result.data);
    } catch (err) {
      console.error("Erreur fichiers client:", err);
    }
  };

  // Fonction d'actualisation manuelle
  const handleManualRefresh = async () => {
    setRefreshing(true);
    await Promise.all([onRefresh(), fetchFiles()]);
    setTimeout(() => setRefreshing(false), 600); // Petit délai pour voir l'icône tourner
  };

  useEffect(() => {
    fetchFiles();
    onRefresh();
  }, []); // Pas d'intervalle, seulement au chargement

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;
    setSending(true);
    try {
      const response = await fetch(apiUrl("/api/signalements/createMessage"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idSignalement, bodymessage: newMessage }),
      });
      if (response.ok) { 
        setNewMessage(""); 
        onRefresh(); 
      }
    } catch (err) { 
      console.error(err); 
    } finally { 
      setSending(false); 
    }
    };
    // --- LOGIQUE UPLOAD (IMPORT) ---

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    
    // Utilise idSignalement (la prop) et non id (du params)
    if (!selectedFile || !idSignalement) return;

    setUploading(true);
      try {
        const formData = new FormData();
        // On convertit en string pour FormData
        formData.append("idSignalement", idSignalement.toString());
        formData.append("file", selectedFile); 

        // ATTENTION : Vérifie bien que l'URL est /api/signalements/createFile (Public)
        // et non /api/admin/... (Réservé aux admins)
        const response = await fetch(apiUrl("/api/signalements/createFile"), {
          method: "POST",
          // Pas de headers Content-Type, le navigateur s'en charge avec FormData
          body: formData,
        });

        if (response.ok) {
          await fetchFiles(); // Rafraîchir la liste des fichiers
          if (fileInputRef.current) fileInputRef.current.value = "";
        } else {
          const errorData = await response.json();
          console.error("Erreur serveur:", errorData);
          alert("Erreur lors de l'envoi du fichier.");
        }
      } catch (err) { 
        console.error("Erreur réseau:", err); 
      } finally { 
        setUploading(false); 
      }
    };


  return (
    <div className="fixed inset-0 flex flex-col h-screen w-full bg-slate-50 z-[100] overflow-hidden">
      <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between shadow-sm w-full z-10">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate("/")} className="group flex items-center gap-2 text-slate-400 hover:text-blue-600 font-medium">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
              <FontAwesomeIcon icon={faArrowLeft} className="text-sm" />
            </div>
            <span>Retour</span>
          </button>
          {/* TITRE DU CHAT AVEC POPUP*/}
          <div className="h-8 w-px bg-slate-200 mx-2" />
            <InfoTracking 
            idSignalement={Number(idSignalement)}
            trackingCode={trackingCode} 
            password={password} />
          <div className="flex items-center gap-2 ml-4 overflow-x-auto max-w-sm no-scrollbar">
            {attachments.map((file) => (
              <a key={file.id} href={file.url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all whitespace-nowrap">
                <FontAwesomeIcon icon={faFileLines} />
                Doc #{file.id}
              </a>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* BOUTON ACTUALISER CLIENT */}
          <button 
            onClick={handleManualRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-bold transition-all active:scale-95 disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faSyncAlt} className={`${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Actualisation..." : "Actualiser"}
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-100 text-emerald-700 font-bold text-[10px] uppercase tracking-widest">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Canal sécurisé
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {messages.map((msg: Message) => (
            <div key={msg.id} className={`flex w-full ${msg.userId !== null ? "justify-start" : "justify-end"} animate-in fade-in`}>
              <div className={`max-w-[85%] md:max-w-[65%] p-4 rounded-2xl shadow-sm ${msg.userId !== null ? "bg-white border border-slate-200 text-slate-800 rounded-tl-none" : "bg-blue-600 text-white rounded-tr-none"}`}>
                <div className={`flex items-center justify-between gap-6 mb-2 border-b pb-1 ${msg.userId !== null ? "border-slate-100" : "border-white/10"}`}>
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {msg.userId !== null ? `⚖️ ${msg.user?.role.nameRole}` : "👤 Vous"}
                  </span>
                  <span className="text-[10px] opacity-60 font-mono">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.contenu}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>

<footer className="p-6 bg-white border-t border-slate-200 w-full shadow-inner animate-in slide-in-from-bottom duration-500">
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          {uploading && (
            <div className="mb-2 flex items-center gap-2 text-blue-600 text-[10px] font-black uppercase animate-pulse">
              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              Upload en cours...
            </div>
          )}
          
          <form onSubmit={handleSendMessage} className="w-full flex gap-4">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange}
              className="hidden" 
            />
            
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()} 
              disabled={uploading}
              className="w-12 h-12 flex items-center justify-center rounded-2xl border border-slate-200 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm disabled:opacity-50"
            >
              <FontAwesomeIcon icon={uploading ? faSpinner : faPaperclip} className={uploading ? "animate-spin" : "text-lg"} />
            </button>

            <input 
              type="text" 
              value={newMessage} 
              onChange={(e) => setNewMessage(e.target.value)} 
              placeholder="Écrivez votre message..." 
              className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none shadow-inner" 
            />

            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white px-6 py-4 rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-blue-200 active:scale-95 group whitespace-nowrap"
            >
              <span className="font-bold text-sm mr-2">Envoyer</span>
              <FontAwesomeIcon icon={faPaperPlane} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"/>
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
}
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faArrowLeft, faPaperclip, faFileLines, faSyncAlt } from "@fortawesome/free-solid-svg-icons";

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
}

interface Attachment {
  id: number;
  url: string;
  createdAt: string;
  fileSize?: string;
}

// ... (Interfaces Message, ChatBoxProps, Attachment identiques)

export default function ChatBox({ messages, idSignalement, onRefresh }: ChatBoxProps) {
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [refreshing, setRefreshing] = useState(false); // État pour l'animation
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const fetchFiles = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/signalements/file", {
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

  const handleFileClick = () => fileInputRef.current?.click();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;
    setSending(true);
    try {
      const response = await fetch("http://localhost:5000/api/signalements/createMessage", {
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
          <div className="h-8 w-px bg-slate-200 mx-2" />
          <h1 className="text-lg font-bold text-slate-800">Discussion Signalement</h1>
          
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

      <footer className="p-6 bg-white border-t border-slate-200 w-full shadow-lg">
        <form onSubmit={handleSendMessage} className="max-w-5xl mx-auto flex gap-4">
          <input type="file" ref={fileInputRef} className="hidden" onChange={() => {}} />
          <button type="button" onClick={handleFileClick} className="w-12 h-12 flex items-center justify-center rounded-2xl border border-slate-200 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm">
            <FontAwesomeIcon icon={faPaperclip} className="text-lg" />
          </button>
          <input 
            type="text" 
            value={newMessage} 
            onChange={(e) => setNewMessage(e.target.value)} 
            placeholder="Écrivez votre message ici..." 
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-inner" 
          />
          <button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white px-6 py-4 rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-blue-200 active:scale-95 group whitespace-nowrap">
            <span className="font-bold text-sm mr-2">Envoyer</span>
            <FontAwesomeIcon
              icon={faPaperPlane} 
              className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
            />
          </button>
        </form>
      </footer>
    </div>
  );
}
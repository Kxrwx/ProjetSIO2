import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faArrowLeft, faPaperPlane, faPaperclip, faFileLines, 
  faSyncAlt, faSpinner 
} from "@fortawesome/free-solid-svg-icons";

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
    role: { nameRole: string; };
  } | null;
}

interface Attachment {
  id: number;
  url: string;
  createdAt: string;
}

export default function MessagesAdmin() {
  const { id } = useParams<{ id: string }>();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [user, setUser] = useState<any>(null);

  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- LOGIQUE API ---

  const fetchUser = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/user', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
      });
      const result = await response.json();
      if (response.ok)
        setUser(result);
    } catch (error) { 
      console.error(error); 
    }
  };

  const fetchFiles = useCallback(async () => {
    if (!id) return;
    try {
      const response = await fetch("http://localhost:5000/api/admin/signalement/file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ idSignalement: Number(id) }),
      });
      const result = await response.json();
      if (result.data) setAttachments(result.data);
    } catch (err) { console.error(err); }
  }, [id]);

  const fetchMessages = useCallback(async () => {
    if (!id) return;
    try {
      const response = await fetch("http://localhost:5000/api/admin/signalement/getMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ idSignalement: Number(id) }),
      });
      const result = await response.json();
      setMessages(Array.isArray(result) ? result : []);
    } catch (err) { console.error(err); }
  }, [id]);

  useEffect(() => {
    fetchMessages();
    fetchFiles();
    fetchUser();
  }, [fetchMessages, fetchFiles]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- LOGIQUE UPLOAD (IMPORT) ---

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile || !id) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("idSignalement", id);
      formData.append("file", selectedFile); 

      const response = await fetch("http://localhost:5000/api/admin/signalement/createFile", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (response.ok) {
        await fetchFiles(); 
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } catch (err) { console.error(err); } 
    finally { setUploading(false); }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;
    setSending(true);
    try {
      const response = await fetch("http://localhost:5000/api/admin/signalement/createMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ idSignalement: Number(id), bodymessage: newMessage }),
      });
      if (response.ok) {
        setNewMessage("");
        fetchMessages();
      }
    } catch (err) { console.error(err); } 
    finally { setSending(false); }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchMessages(), fetchFiles()]);
    setTimeout(() => setRefreshing(false), 500);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 overflow-hidden">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between shadow-sm w-full z-10">
        <div className="flex items-center gap-6">
          <Link to={`/admin/signalement/detail/${id}`} className="group flex items-center gap-2 text-slate-400 hover:text-blue-600 font-medium transition-all">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-blue-50">
              <FontAwesomeIcon icon={faArrowLeft} className="text-sm" />
            </div>
            <span>Retour</span>
          </Link>
          <div className="h-8 w-px bg-slate-200 mx-2" />
          
          {/* ANCIENNE DISPOSITION DES FICHIERS */}
          <div className="flex items-center gap-2 ml-4 overflow-x-auto max-w-md no-scrollbar">
            {attachments.map((file) => (
              <a 
                key={file.id} 
                href={file.url} 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-all whitespace-nowrap"
              >
                <FontAwesomeIcon icon={faFileLines} className="text-blue-500" />
                PIÈCE #{file.id}
              </a>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-bold transition-all active:scale-95 disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faSyncAlt} className={`${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Actualisation..." : "Actualiser"}
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-100 font-bold text-[10px] text-emerald-700 uppercase tracking-widest">
             <span className="relative flex h-2 w-2">
               <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
               <span className="relative rounded-full h-2 w-2 bg-emerald-500"></span>
             </span>
             Canal sécurisé
          </div>
        </div>
      </header>

      {/* MESSAGES */}
      <main className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex w-full ${msg.userId !== null ? "justify-end" : "justify-start"} animate-in fade-in`}>
              <div className={`max-w-[85%] md:max-w-[65%] p-4 rounded-2xl shadow-sm ${msg.userId !== null ? "bg-blue-600 text-white rounded-tr-none shadow-blue-100" : "bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-slate-200/50"}`}>
                <div className={`flex items-center justify-between gap-6 mb-2 border-b pb-1.5 ${msg.userId !== null ? "border-white/10" : "border-slate-100"}`}>
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {msg.userId !== null ? `⚖️ ${msg.user?.role.nameRole || "Admin"}` : "👤 Déclarant"}
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

      {/* FOOTER AU MILIEU */}
      <footer className="p-6 bg-white border-t border-slate-200 w-full shadow-inner animate-in slide-in-from-bottom duration-500">
        <div className="max-w-5xl mx-auto flex flex-col items-center w-full">
          
          {/* CONDITION : Si idRole === 3, on affiche le formulaire de réponse */}
          {user?.role.idRole === 3 ? (
            <>
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
                  placeholder="Écrivez votre réponse en tant que juriste..." 
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
            </>
          ) : (
            /* BANDEAU POUR LES AUTRES (Non-Juristes) */
            <div className="w-full p-4 bg-slate-50 border border-dashed border-slate-300 rounded-2xl flex items-center justify-center gap-3 text-slate-500">
              <div className="w-2 h-2 rounded-full bg-slate-300 animate-pulse" />
              <span className="text-xs font-medium italic">
                Seuls les membres du pôle juridique (ID: 3) peuvent répondre à ce signalement.
              </span>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
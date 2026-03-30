import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faArrowLeft, faPaperPlane, faPaperclip, faFileLines, 
  faSyncAlt, faSpinner, faDownload 
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
  name: string;
  createdAt: string;
  fileSize?: string;
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

  // 1. Récupération des fichiers
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
    } catch (err) {
      console.error("Erreur fichiers admin:", err);
    }
  }, [id]);

  // 2. Récupération des messages
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
    } catch (err) { 
      console.error("Erreur messages admin:", err); 
    }
  }, [id]);

  const fetchUser = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/user', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
      });
      const result = await response.json();
      if (response.ok) setUser(result);
    } catch (error) {
      console.error("Erreur connexion:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchFiles();
    fetchUser();
  }, [fetchMessages, fetchFiles]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- LOGIQUE D'UPLOAD ET COMPRESSION ---

  // Helper : Compression Image (Canvas)
  const compressImage = (file: File): Promise<File> => new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(new File([blob], file.name, { type: 'image/jpeg', lastModified: Date.now() }));
          }
        }, 'image/jpeg', 0.7);
      };
    };
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile || !id) return;

    setUploading(true);

    try {
      // 1. Compression si c'est une image
      const processedFile = selectedFile.type.startsWith('image/') 
        ? await compressImage(selectedFile) 
        : selectedFile;

      // 2. Préparation du FormData pour req.file côté backend
      const formData = new FormData();
      formData.append("idSignalement", id);
      formData.append("file", processedFile); 

      const response = await fetch("http://localhost:5000/api/admin/signalement/createFile", {
        method: "POST",
        credentials: "include",
        // IMPORTANT: Ne pas définir de Content-Type header ici, 
        // le navigateur le fera automatiquement avec le boundary correct.
        body: formData,
      });

      if (response.ok) {
        await fetchFiles(); 
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        const err = await response.json();
        alert(err.error || "Erreur lors de l'envoi");
      }
    } catch (err) {
      console.error("Erreur upload:", err);
      alert("Erreur lors de l'envoi du fichier.");
    } finally {
      setUploading(false);
    }
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
    } catch (err) { 
      console.error(err); 
    } finally { 
      setSending(false); 
    }
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
          
          <div className="flex items-center gap-2 ml-4 overflow-x-auto max-w-md no-scrollbar">
            {attachments.length === 0 && <span className="text-[10px] text-slate-400 italic">Aucune pièce jointe</span>}
            {attachments.map((file) => (
  <a 
    key={file.id} 
    href={file.url} 
    target="_blank" 
    rel="noreferrer" 
    className="..."
    title={file.name}
  >
    <FontAwesomeIcon icon={faFileLines} className="text-blue-500" />
    {file.name} {/* Affiche le vrai nom du fichier */}
    <FontAwesomeIcon icon={faDownload} className="ml-1 opacity-50" />
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
        </div>
      </header>

      {/* MESSAGES */}
      <main className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex w-full ${msg.userId !== null ? "justify-end" : "justify-start"}`}>
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

      {/* FOOTER */}
      {user?.role?.idRole !== 2 ? (
        <footer className="p-6 bg-white border-t border-slate-200 w-full shadow-inner">
          <div className="max-w-5xl mx-auto">
            {uploading && (
              <div className="mb-2 flex items-center gap-2 text-blue-600 text-xs font-bold animate-pulse">
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                Traitement et transfert vers R2...
              </div>
            )}
            
            <form onSubmit={handleSendMessage} className="flex gap-4">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange}
                className="hidden" 
                accept="image/*,.pdf,.doc,.docx"
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
                placeholder="Écrivez votre réponse..." 
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
      ) : (
        <footer className="p-6 bg-slate-100 border-t border-slate-200 w-full">
           <div className="max-w-5xl mx-auto flex items-center justify-center gap-4 py-2 px-6 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 shadow-sm">
            <div className="w-10 h-10 flex items-center justify-center bg-amber-100 rounded-full text-amber-600">
              <FontAwesomeIcon icon={faFileLines} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm">Mode Consultation Uniquement</span>
              <p className="text-xs opacity-80">
                En tant que <strong>{user?.role?.nameRole}</strong>, vous ne pouvez pas envoyer de fichiers ou de messages.
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPaperPlane, faPaperclip, faFileLines } from "@fortawesome/free-solid-svg-icons";

export default function MessagesAdmin() {
  const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<any[]>([]);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Récupération des fichiers via ton code node.js (getFileAdmin)
  const fetchFiles = useCallback(async () => {
    if (!id) return;
    try {
      const response = await fetch("http://localhost:5000/api/admin/signalement/getFiles", {
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
    const interval = setInterval(() => { fetchMessages(); fetchFiles(); }, 20000);
    return () => clearInterval(interval);
  }, [fetchMessages, fetchFiles]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
      if (response.ok) { setNewMessage(""); fetchMessages(); }
    } catch (err) { console.error(err); } finally { setSending(false); }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 overflow-hidden">
      <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between shadow-sm w-full z-10">
        <div className="flex items-center gap-6">
          <Link to={`/admin/signalement/detail/${id}`} className="group flex items-center gap-2 text-slate-400 hover:text-blue-600 font-medium transition-all">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-blue-50">
              <FontAwesomeIcon icon={faArrowLeft} className="text-sm" />
            </div>
            <span>Retour</span>
          </Link>
          <div className="h-8 w-px bg-slate-200 mx-2" />
          <h1 className="text-lg font-bold text-slate-800 tracking-tight">Discussion Signalement <span className="text-blue-600">#{id}</span></h1>
          
          {/* Liste des pièces jointes du signalement dans le header */}
          <div className="flex items-center gap-2 ml-4 overflow-x-auto max-w-md no-scrollbar">
            {attachments.map((file) => (
              <a key={file.id} href={file.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-all whitespace-nowrap">
                <FontAwesomeIcon icon={faFileLines} className="text-blue-500" />
                PIÈCE #{file.id}
              </a>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-100 font-bold text-[10px] text-emerald-700 uppercase tracking-widest">
           <span className="relative flex h-2 w-2"><span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative rounded-full h-2 w-2 bg-emerald-500"></span></span>
           Canal sécurisé
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex w-full ${msg.userId !== null ? "justify-end" : "justify-start"} animate-in fade-in`}>
              <div className={`max-w-[85%] md:max-w-[65%] p-4 rounded-2xl shadow-sm ${msg.userId !== null ? "bg-blue-600 text-white rounded-tr-none shadow-blue-100" : "bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-slate-200/50"}`}>
                <div className={`flex items-center justify-between gap-6 mb-2 border-b pb-1.5 ${msg.userId !== null ? "border-white/10" : "border-slate-100"}`}>
                  <span className="text-[10px] font-black uppercase tracking-widest">{msg.userId !== null ? "⚖️ Vous" : "👤 Déclarant"}</span>
                  <span className="text-[10px] opacity-60 font-mono">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.contenu}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="p-6 bg-white border-t border-slate-200 w-full shadow-inner">
        <form onSubmit={handleSendMessage} className="max-w-5xl mx-auto flex gap-4">
          <input type="file" ref={fileInputRef} className="hidden" />
          <button type="button" onClick={() => fileInputRef.current?.click()} className="w-12 h-12 flex items-center justify-center rounded-2xl border border-slate-200 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm">
            <FontAwesomeIcon icon={faPaperclip} className="text-lg" />
          </button>
          <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Écrivez votre message..." className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none shadow-inner" />
          <button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white px-6 py-4 rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-blue-200 active:scale-95 group whitespace-nowrap">
            <span className="font-bold text-sm mr-2">Envoyer</span>
            <FontAwesomeIcon
            icon={faPaperPlane} 
            className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"/>
          </button>
        </form>
      </footer>
    </div>
  );
}
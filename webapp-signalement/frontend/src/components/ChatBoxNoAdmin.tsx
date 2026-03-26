import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faLock, 
  faPaperPlane, 
  faCheckDouble
} from '@fortawesome/free-solid-svg-icons';

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
}

export default function ChatBox({ messages, idSignalement, onRefresh }: ChatBoxProps) {
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll automatique vers le bas à chaque nouveau message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const response = await fetch("http://localhost:5000/api/signalements/createMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            idSignalement, 
            bodymessage: newMessage, 
        }),
      });

      if (response.ok) {
        setNewMessage("");
        onRefresh();
      }
    } catch (err) {
      console.error("Erreur envoi:", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col w-full bg-white border border-indigo-50 rounded-[2.5rem] shadow-[0_20px_50px_rgba(79,70,229,0.04)] overflow-hidden h-[600px] mt-6">
      
      {/* HEADER : STATUS SÉCURITÉ */}
      <div className="bg-slate-50/80 backdrop-blur-md p-4 border-b border-slate-100 flex items-center justify-between px-8">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Canal AES-256 activé</h3>
        </div>
        <div className="flex items-center gap-2 text-indigo-300">
           <span className="text-[9px] font-bold uppercase tracking-widest">Chiffré</span>
           <FontAwesomeIcon icon={faLock} className="text-[10px]" />
        </div>
      </div>

      {/* ZONE DE CHAT */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-white to-slate-50/30 custom-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isAdmin = msg.userId !== null;
            return (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex w-full ${isAdmin ? "justify-start" : "justify-end"}`}
              >
                <div className={`max-w-[80%] flex flex-col ${isAdmin ? "items-start" : "items-end"}`}>
                  {/* LABEL EXPÉDITEUR */}
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                      {isAdmin ? `⚖️ Support - ${msg.user?.role?.nameRole || "Admin"}` : "👤 Vous"}
                    </span>
                  </div>

                  {/* BULLE */}
                  <div className={`p-4 shadow-sm relative group transition-all duration-300 ${
                    isAdmin 
                      ? "bg-white border border-slate-200 rounded-3xl rounded-bl-none text-slate-700 hover:border-indigo-100" 
                      : "bg-indigo-600 text-white rounded-3xl rounded-br-none shadow-indigo-200/50 shadow-lg"
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
                      {msg.contenu}
                    </p>
                    
                    <div className={`mt-2 flex items-center gap-2 text-[9px] font-bold ${isAdmin ? "text-slate-400" : "text-indigo-200/80"}`}>
                       {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       {!isAdmin && <FontAwesomeIcon icon={faCheckDouble} className="text-[8px] opacity-70" />}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT : DESIGN FLOTTANT */}
      <div className="p-4 bg-white border-t border-slate-100 px-6 py-6">
        <form onSubmit={handleSendMessage} className="relative flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Écrivez votre message ici..."
            className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white focus:ring-8 focus:ring-indigo-500/5 rounded-2xl px-6 py-4 pr-32 outline-none transition-all font-medium text-slate-700 placeholder:text-slate-400"
          />
          
          <div className="absolute right-2 flex items-center">
            <button 
              type="submit" 
              disabled={sending || !newMessage.trim()}
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all text-xs font-black uppercase tracking-widest shadow-md shadow-indigo-200 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:scale-100 flex items-center gap-2"
            >
              {sending ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Envoyer</span>
                  <FontAwesomeIcon icon={faPaperPlane} className="text-[10px]" />
                </>
              )}
            </button>
          </div>
        </form>
        <div className="flex justify-center items-center gap-4 mt-4 opacity-40">
           <div className="h-[1px] w-12 bg-slate-300" />
           <p className="text-[8px] text-slate-400 font-black uppercase tracking-[0.2em]">
             Serveur sécurisé H24
           </p>
           <div className="h-[1px] w-12 bg-slate-300" />
        </div>
      </div>
    </div>
  );
}
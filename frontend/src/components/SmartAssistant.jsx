import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Sparkles, Wand2, Mail, FileText, Search } from "lucide-react";
import { askAssistant } from "../api";
import toast from "react-hot-toast";

const SmartAssistant = () => {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hello! I'm your Recruitment Assistant. How can I help you today? I can help search candidates, summarize resumes, or draft hiring emails." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    try {
      const { data } = await askAssistant(userMessage);
      if (data.success) {
        setMessages(prev => [...prev, { role: "ai", text: data.answer, intent: data.intent }]);
      }
    } catch (error) {
      const serverMsg = error.response?.data?.error || "";
      const isRateLimit = serverMsg.includes("429") || serverMsg.includes("rate");
      if (isRateLimit) {
        toast.error("Assistant is rate-limited. Please wait a moment and try again.");
        setMessages(prev => [...prev, { role: "ai", text: "I'm temporarily rate-limited. Please wait 30-60 seconds and try again." }]);
      } else {
        toast.error("Assistant encountered an error.");
        setMessages(prev => [...prev, { role: "ai", text: `Error: ${serverMsg || "Something went wrong. Please check the server logs."}` }]);
      }
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { icon: <Search className="w-3 h-3" />, label: "Find React Devs", prompt: "Find me candidates with React skills." },
    { icon: <FileText className="w-3 h-3" />, label: "Summarize Top Resumes", prompt: "Summarize the resumes of the most recent applicants." },
    { icon: <Mail className="w-3 h-3" />, label: "Draft Invite Email", prompt: "Draft a professional interview invitation email." }
  ];

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-primary-600 to-indigo-600 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-black text-sm uppercase tracking-widest">Recruiter Assistant</h3>
            <div className="flex items-center gap-1.5">
               <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
               <span className="text-[10px] font-bold opacity-80">Powered by Gemini</span>
            </div>
          </div>
        </div>
        <Sparkles className="w-5 h-5 opacity-50" />
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50/50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
            <div className={`max-w-[85%] flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
               <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === "user" ? "bg-primary-100 text-primary-600" : "bg-white text-indigo-600"}`}>
                 {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
               </div>
               <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                 msg.role === "user" 
                   ? "bg-primary-600 text-white shadow-lg shadow-primary-600/20 rounded-tr-none" 
                   : "bg-white text-slate-700 shadow-sm border border-slate-100 rounded-tl-none"
               }`}>
                 <div className="whitespace-pre-wrap">{msg.text}</div>
                 {msg.intent && (
                    <div className="mt-2 flex items-center gap-1 opacity-50 text-[10px] italic">
                       <Wand2 className="w-3 h-3" /> Processed as {msg.intent} query
                    </div>
                 )}
               </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start animate-fade-in">
             <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-white text-indigo-600 flex items-center justify-center shadow-sm">
                   <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 rounded-tl-none flex items-center gap-2">
                   <Loader2 className="w-4 h-4 animate-spin text-primary-600" />
                   <span className="text-xs text-slate-400 font-medium">Analyzing database...</span>
                </div>
             </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Footer / Input */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex flex-wrap gap-2 mb-4">
           {quickActions.map((action, i) => (
             <button 
               key={i} 
               onClick={() => setInput(action.prompt)}
               className="text-[10px] font-bold bg-slate-50 text-slate-500 hover:bg-primary-50 hover:text-primary-600 px-3 py-1.5 rounded-full border border-slate-200 transition-all flex items-center gap-2"
             >
               {action.icon} {action.label}
             </button>
           ))}
        </div>
        <form onSubmit={handleSend} className="relative">
          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything hiring related..." 
            className="w-full bg-slate-100 border-none rounded-xl py-3.5 pl-4 pr-12 text-sm focus:ring-2 focus:ring-primary-500 transition-all"
          />
          <button 
            type="submit" 
            disabled={loading || !input.trim()}
            className="absolute right-2 top-1.5 p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all disabled:opacity-50 shadow-lg shadow-primary-600/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default SmartAssistant;

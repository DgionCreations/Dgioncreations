import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, X, Send, Bot, User, Sparkles, 
  ChevronDown, Maximize2, Minimize2, Trash2 
} from "lucide-react";

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: Date;
}

export default function AIAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm DI (Dgion Intelligence). How can I help you architect your digital future today?",
      timestamp: new Date(),
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI Response
    setTimeout(() => {
      const response = generateMockResponse(input);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const generateMockResponse = (userInput: string) => {
    const text = userInput.toLowerCase();
    if (text.includes("service") || text.includes("work")) {
      return "Dgion specializes in high-impact digital experiences, including AI integration, custom software, and strategic branding. You can view our full list of services in the Services section.";
    }
    if (text.includes("contact") || text.includes("hire")) {
      return "We'd love to discuss your project! You can reach us through our Contact page or book a discovery call directly.";
    }
    if (text.includes("price") || text.includes("cost")) {
      return "Our projects typically start at $25k. However, we tailor every engagement to the specific needs and scale of the architecture required. Shall I guide you to our contact form for a quote?";
    }
    if (text.includes("who are you") || text.includes("dgion")) {
      return "We are a high-end digital agency dedicated to transforming businesses through technology and superior design. Dgion is where strategy meets architecture.";
    }
    return "That's an interesting challenge. At Dgion, we believe in solving complex problems through architectural thinking. Would you like to know more about our process or see our portfolio?";
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] font-sans" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#837FFB] to-[#5B57F5] flex items-center justify-center text-white shadow-[0_10px_30px_rgba(131,127,251,0.5)] hover:scale-110 transition-transform group"
          >
            <div className="absolute inset-0 rounded-full bg-[#837FFB] animate-ping opacity-20" />
            <MessageSquare className="w-7 h-7 group-hover:rotate-12 transition-transform" />
          </motion.button>
        )}

        {isOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.9 }}
            className={`bg-[#0D0B24]/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col transition-all duration-300 ${
              isMinimized
                ? "h-16 w-[calc(100vw-2rem)] max-w-xs md:w-72"
                : "h-[min(70vh,500px)] w-[calc(100vw-2rem)] max-w-sm md:w-96"
            }`}
          >
            {/* Header */}
            <div className="p-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#837FFB] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm tracking-tight">DI Assistant</div>
                  <div className="text-[10px] text-[#837FFB] font-bold uppercase tracking-widest flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-[#837FFB] animate-pulse" />
                    Online
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-colors"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-red-500/20 rounded-lg text-white/40 hover:text-red-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages Area */}
                <div 
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
                >
                  {messages.map((m) => (
                    <div 
                      key={m.id} 
                      className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`flex gap-3 max-w-[85%] ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${m.role === "assistant" ? "bg-[#837FFB]/20 text-[#837FFB]" : "bg-white/10 text-white"}`}>
                          {m.role === "assistant" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                        </div>
                        <div 
                          className={`p-3 rounded-2xl text-sm leading-relaxed ${
                            m.role === "user" 
                              ? "bg-[#837FFB] text-white rounded-tr-none" 
                              : "bg-white/5 text-white/80 rounded-tl-none border border-white/5"
                          }`}
                        >
                          {m.content}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white/5 border border-white/5 p-3 rounded-2xl rounded-tl-none flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white/5 border-t border-white/5">
                  <div className="relative">
                    <input 
                      type="text" 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      placeholder="Type your message..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#837FFB]/50 transition-colors pr-12"
                    />
                    <button 
                      onClick={handleSend}
                      disabled={!input.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-[#837FFB] flex items-center justify-center text-white disabled:opacity-50 disabled:grayscale transition-all hover:scale-105 active:scale-95"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-2 text-[9px] text-center text-white/20 uppercase tracking-widest font-bold">
                    Powered by Dgion Architecture
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

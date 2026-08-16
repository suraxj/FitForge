import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, User, Dumbbell, MapPin, Phone, Award, CheckCircle2 } from 'lucide-react';

const FAQ_PRESETS = [
  {
    id: 'trial',
    icon: '🏋️',
    label: 'Claim 1-Day Free Pass',
    question: 'How do I claim a Free 1-Day Trial Pass?',
    answer: 'You can claim a free 1-day pass by clicking the "Register" or "Try Us Free" button on our site. Once registered, show your pass at our front desk (Plot 11 & 12, I.P. Extension, Delhi) for instant access!'
  },
  {
    id: 'pricing',
    icon: '💳',
    label: 'Membership Plans & Pricing',
    question: 'What are the membership plans & pricing?',
    answer: 'FitForge offers flexible plans:\n• Basic Monthly: ₹2,499/mo (Peak Gym Access)\n• Pro Performance: ₹4,999/mo (24/7 Access + Sauna + Turf)\n• Elite Annual: ₹14,999/yr (Unlimited Access + 3 Coaching Sessions + Spa)'
  },
  {
    id: 'location',
    icon: '📍',
    label: 'Gym Location & Hours',
    question: 'Where is FitForge located & what are the opening hours?',
    answer: 'We are located at Plot No 11 & 12, LSC, I.P. Extension, Patparganj, New Delhi 110092.\nWe are OPEN 24 HOURS A DAY, 7 DAYS A WEEK with biometric smart gate access!'
  },
  {
    id: 'coaching',
    icon: '🧘',
    label: 'Coaching & Recovery Sauna',
    question: 'Do you offer 1-on-1 personal coaching & saunas?',
    answer: 'Yes! We have 15+ certified master trainers for strength, body transformation, and HIIT. We also feature contrast recovery zones with far-infrared steam saunas.'
  }
];

const FitnessChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hi there! 👋 Welcome to FitForge Gym Delhi!\nHow can we help your fitness journey today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSelectPreset = (preset) => {
    const userMsg = {
      sender: 'user',
      text: preset.question,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const botMsg = {
        sender: 'bot',
        text: preset.answer,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText;
    setInputText('');
    const userMsg = {
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = 'Thank you for your message! Our team at FitForge Delhi will get back to you shortly. You can also chat directly with our head coach on WhatsApp at +91 9625166582.';
      const lower = userText.toLowerCase();

      if (lower.includes('price') || lower.includes('cost') || lower.includes('fee') || lower.includes('membership')) {
        botResponse = 'Our memberships start at ₹2,499/mo with full gym access, or ₹14,999/year for our All-Access Elite pass!';
      } else if (lower.includes('trial') || lower.includes('free') || lower.includes('pass')) {
        botResponse = 'You can register for a Free 1-Day Trial Pass right here on our site! Visit us at Plot 11 & 12, I.P. Extension, Delhi.';
      } else if (lower.includes('location') || lower.includes('where') || lower.includes('address')) {
        botResponse = 'We are located at Plot No 11 & 12, LSC, I.P. Extension, Patparganj, New Delhi 110092. Open 24/7!';
      }

      const botMsg = {
        sender: 'bot',
        text: botResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group px-5 py-3.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider shadow-2xl shadow-emerald-600/40 flex items-center space-x-2.5 transition-all transform hover:scale-105 border border-emerald-400/40 animate__animated animate__backInRight"
            title="Chat with FitForge AI Assistant"
          >
            <div className="relative">
              <Bot className="w-5 h-5 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-300 rounded-full animate-ping" />
            </div>
            <span>FitForge AI Assistant</span>
          </button>
        )}
      </div>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] h-[520px] max-h-[85vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate__animated animate__backInUp font-['Outfit',sans-serif]">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold">
                <Bot className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-xs font-black uppercase tracking-wider flex items-center space-x-1.5">
                  <span>FitForge Assistant</span>
                  <Sparkles className="w-3 h-3 text-emerald-400 animate-spin" />
                </div>
                <div className="text-[10px] text-emerald-400 font-bold flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Online • Delhi Gym Support</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/70 dark:bg-slate-950/70 text-xs">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1`}
              >
                <div
                  className={`max-w-[85%] px-4 py-2.5 rounded-2xl leading-relaxed whitespace-pre-line ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-none shadow-md font-medium'
                      : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-bl-none shadow-sm font-medium'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-slate-400 px-1 font-mono">{msg.time}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center space-x-2 text-slate-400 text-xs italic p-2 bg-white dark:bg-slate-900 rounded-2xl w-fit border border-slate-200 dark:border-slate-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[10px] not-italic font-bold text-emerald-600 dark:text-emerald-400 ml-1">FitForge AI typing...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* FAQ Preset Quick Buttons */}
          <div className="p-2.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider px-1">Quick Questions:</span>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {FAQ_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500/10 text-slate-700 dark:text-slate-300 hover:text-emerald-600 border border-slate-200 dark:border-slate-700 transition-colors flex items-center space-x-1"
                >
                  <span>{preset.icon}</span>
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="p-3 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-full px-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="p-2.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 transition-all shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default FitnessChatbot;

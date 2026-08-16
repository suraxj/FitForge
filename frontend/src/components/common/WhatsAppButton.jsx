import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  const whatsappNumber = '919625166582';
  const defaultMessage = encodeURIComponent(
    'Hi FitForge Gym Delhi! 👋 I would like to inquire about 24/7 gym memberships, free trial passes, and personal coaching.'
  );

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${defaultMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-50 p-3.5 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-2xl shadow-emerald-900/40 flex items-center space-x-2 transition-all transform hover:scale-110 border border-emerald-400/40 animate__animated animate__bounceIn"
      title="Chat directly on WhatsApp with FitForge Gym (+91 9625166582)"
    >
      <MessageCircle className="w-6 h-6 fill-white text-[#25D366]" />
      <span className="hidden sm:inline text-xs font-black uppercase tracking-wider pr-1">WhatsApp Us</span>
    </a>
  );
};

export default WhatsAppButton;

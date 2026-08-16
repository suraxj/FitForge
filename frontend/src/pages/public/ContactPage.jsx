import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, ShieldCheck, Dumbbell, Sparkles, ChevronDown, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'Free Trial Pass',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success(`Thank you, ${formData.name}! Your inquiry for "${formData.inquiryType}" has been received. Our team will call you back shortly.`);
      setFormData({ name: '', email: '', phone: '', inquiryType: 'Free Trial Pass', message: '' });
      setLoading(false);
    }, 600);
  };

  const faqs = [
    {
      q: 'Where is FitForge Gym located in Delhi?',
      a: 'FitForge Gym is located at Plot No. 11 & 12, Local Shopping Complex (LSC), I.P. Extension, Patparganj, New Delhi 110092 (Near Max Super Speciality Hospital & IP Extension Metro Station).'
    },
    {
      q: 'Is FitForge Gym open 24 hours a day?',
      a: 'Yes! FitForge features 24/7 biometric smart keycard access. Members can train anytime day or night, 365 days a year with full security.'
    },
    {
      q: 'How do I claim a Free 1-Day Trial Pass?',
      a: 'Select "Free Trial Pass" in the contact form or click "Register" on the top navigation. Show your pass at our front desk for instant complimentary access!'
    },
    {
      q: 'What equipment and amenities are available?',
      a: 'We feature Rogue Olympic power cages, Eleiko bars, Concept2 rowers, functional turf sleds, 1-on-1 personal training, and contrast far-infrared steam saunas.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-['Outfit',sans-serif] py-10 px-4 sm:px-6 lg:px-8 space-y-12 transition-colors duration-300">
      
      {/* Local SEO JSON-LD Structured Data Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ExerciseGym",
          "name": "FitForge Gym Delhi",
          "image": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Plot No 11 and 12, LSC, I.P. Extension, Patparganj",
            "addressLocality": "New Delhi",
            "addressRegion": "Delhi",
            "postalCode": "110092",
            "addressCountry": "IN"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "28.6291",
            "longitude": "77.3060"
          },
          "telephone": "+919625166582",
          "openingHours": "Mo-Su 00:00-24:00",
          "priceRange": "₹₹",
          "url": "https://fitforge.com"
        })}
      </script>

      {/* Header Banner */}
      <div className="max-w-4xl mx-auto text-center space-y-4 animate__animated animate__backInDown">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-black uppercase tracking-widest">
          <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>DELHI, I.P. EXTENSION • 24/7 OPEN</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
          CONTACT <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 dark:from-emerald-400 dark:via-teal-400 dark:to-emerald-300 bg-clip-text text-transparent">FITFORGE GYM</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto font-medium leading-relaxed">
          Ready to transform your physique? Call us, visit our Patparganj facility, or send us a message below.
        </p>
      </div>

      {/* 3 Contact Info Cards (Indian Phone & Location) */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 — Delhi Address */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 text-center hover:border-emerald-500/40 transition-all hover:-translate-y-1 animate__animated animate__backInLeft">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
            <MapPin className="w-6 h-6 animate__animated animate__pulse animate__infinite" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black uppercase text-slate-900 dark:text-white">Visit Gym Floor</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold leading-relaxed">
              Plot No 11 & 12, LSC, I.P. Extension, Patparganj, New Delhi 110092
            </p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold pt-1">
              Near Max Hospital & IP Extension Metro
            </p>
          </div>
        </div>

        {/* Card 2 — Indian Phone Numbers */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 text-center hover:border-emerald-500/40 transition-all hover:-translate-y-1 animate__animated animate__backInDown">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto border border-teal-500/30">
            <Phone className="w-6 h-6 animate__animated animate__headShake animate__infinite" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black uppercase text-slate-900 dark:text-white">Call or WhatsApp</h3>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-extrabold">
              +91 9625166582 | +91 7982746995
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Front Desk Hours: 24/7 Keypass Entrance
            </p>
          </div>
        </div>

        {/* Card 3 — Email & Support */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 text-center hover:border-emerald-500/40 transition-all hover:-translate-y-1 animate__animated animate__backInRight">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
            <Mail className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black uppercase text-slate-900 dark:text-white">Email Support</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold">
              support@fitforge.com
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Guaranteed reply within 2 hours
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Form + Google Map Embed */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Contact Form */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 animate__animated animate__backInLeft">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black uppercase text-slate-900 dark:text-white tracking-tight">
              SEND AN INQUIRY
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              Fill in your details below to schedule a tour or claim your trial pass.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Rohan Sharma"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="rohan@example.com"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">Phone Number (WhatsApp)</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">Inquiry Topic</label>
                <select
                  value={formData.inquiryType}
                  onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Free Trial Pass">Free 1-Day Trial Pass</option>
                  <option value="Membership Pricing">Membership Pricing & Plans</option>
                  <option value="1-on-1 Personal Training">1-on-1 Personal Training</option>
                  <option value="Sauna & Recovery Suite">Sauna & Recovery Suite</option>
                  <option value="SaaS Gym Software">FitForge SaaS Gym Platform</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">Your Message</label>
              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell us about your fitness goals or questions..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full font-black text-xs uppercase tracking-wider bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              <span>SEND INQUIRY NOW</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Column: Google Maps Location & Quick Direct WhatsApp Card */}
        <div className="lg:col-span-5 space-y-6 animate__animated animate__backInRight">
          {/* Direct WhatsApp Callout Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 border border-emerald-500/40 text-white space-y-4 shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-[#25D366] text-white flex items-center justify-center font-bold">
                <MessageCircle className="w-6 h-6 fill-white text-[#25D366]" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase">Instant WhatsApp Support</h3>
                <p className="text-xs text-emerald-400 font-bold">+91 9625166582</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Want immediate answers regarding membership slots, trainer availability, or gym entry? Chat with our head coach on WhatsApp now.
            </p>
            <a
              href="https://wa.me/919625166582?text=Hi%20FitForge%20Gym%20Delhi%2C%20I%20want%20to%20inquire%20about%20memberships."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full py-3 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-black uppercase tracking-wider shadow-lg transition-all"
            >
              <MessageCircle className="w-4 h-4 mr-2 fill-white" />
              <span>START WHATSAPP CHAT</span>
            </a>
          </div>

          {/* Interactive Google Map Box */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Delhi Gym Location Map</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                I.P. Extension
              </span>
            </div>
            <div className="w-full h-64 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 relative bg-slate-100 dark:bg-slate-950">
              <iframe
                title="FitForge Gym Delhi Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.164395697686!2d77.3060!3d28.6291!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDM3Jz40LjgnTiA3N8KwMTgnMjEuNiJF!5e0!3m2!1sen!2sin!4v1650000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

      </div>

      {/* SEO FAQ Accordion Section */}
      <div className="max-w-4xl mx-auto pt-8 space-y-6 border-t border-slate-200 dark:border-slate-800 animate__animated animate__backInUp">
        <div className="text-center space-y-2">
          <span className="text-xs font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-widest">FREQUENTLY ASKED QUESTIONS</span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase text-slate-900 dark:text-white">
            EVERYTHING YOU NEED TO KNOW
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openFaqIndex === i;
            return (
              <div
                key={i}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? -1 : i)}
                  className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center justify-between space-x-2"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-emerald-600 dark:text-emerald-400 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium border-t border-slate-100 dark:border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default ContactPage;

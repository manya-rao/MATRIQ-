import React, { useState, useRef, useEffect } from 'react';
import { useRecovery } from '../../context/RecoveryContext';
import { SupportedLanguage, AIMessage } from '../../types';
import {
  Sparkles,
  Send,
  Languages,
  ShieldAlert,
  Bot,
  User,
  HelpCircle,
  X,
  Volume2,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

const SUGGESTED_QUESTIONS = [
  'Is brownish-pink bleeding normal for Day 12 C-Section?',
  'How can I tell C-Section scar itching from an infection?',
  'What is the difference between a clogged duct and mastitis?',
  'Safe ways to protect core muscles when lifting baby?',
];

// Rich, clinically accurate bilingual responses for immediate demonstration
const CLINICAL_KNOWLEDGE_BASE: Record<string, Record<SupportedLanguage, string>> = {
  bleeding: {
    en: 'At Day 12 postpartum, bleeding typically transitions from bright red (Lochia Rubra) to a brownish-pink or yellowish discharge known as Lochia Serosa. This is a normal, healthy indicator that your uterine lining is contracting and healing. If you suddenly soak more than one pad per hour or pass clots larger than a golf ball, seek emergency obstetric triage immediately.',
    hi: 'प्रसव के 12वें दिन (Day 12), रक्तस्राव आमतौर पर गहरे लाल से हल्के भूरे-गुलाबी रंग (Lochia Serosa) में बदल जाता है। यह एक सामान्य और स्वस्थ संकेत है कि आपका गर्भाशय सिकुड़ रहा है और ठीक हो रहा है। यदि आप एक घंटे में 1 से अधिक पैड भिगोती हैं, तो तुरंत आपातकालीन डॉक्टर से संपर्क करें।',
    kn: 'ಹೆರಿಗೆಯ 12 ನೇ ದಿನದಲ್ಲಿ, ರಕ್ತಸ್ರಾವವು ಸಾಮಾನ್ಯವಾಗಿ ಕೆಂಪು ಬಣ್ಣದಿಂದ ತಿಳಿ ಕಂದು ಅಥವಾ ಗುಲಾಬಿ ಬಣ್ಣಕ್ಕೆ (Lochia Serosa) ಬದಲಾಗುತ್ತದೆ. ಇದು ನಿಮ್ಮ ಗರ್ಭಾಶಯವು ಸಹಜವಾಗಿ ಗುಣಮುಖವಾಗುತ್ತಿದೆ ಎಂಬುದರ ಸೂಚನೆ. ರಕ್ತಸ್ರಾವವು ತೀವ್ರವಾಗಿ ಹೆಚ್ಚಾದರೆ ತಕ್ಷಣ ವೈದ್ಯರನ್ನು ಭೇಟಿ ಮಾಡಿ.',
    es: 'En el día 12 posparto, el sangrado suele pasar de rojo brillante a un flujo rosado o marrón llamado Loquios Serosos. Esto indica que el útero está involucionando correctamente. Si empapa más de una toalla sanitaria por hora, consulte a emergencias obstétricas de inmediato.'
  },
  itching: {
    en: 'Gentle itching, tingling, or slight numbness along your Pfannenstiel C-section scar around Day 10–14 is very common. It signifies that superficial cutaneous sensory nerves and collagen fibers are regenerating. However, if the incision turns bright fiery red, feels hot to touch, oozes yellow/green discharge, or begins separating, that suggests surgical site infection.',
    hi: '10 से 14 दिनों के आसपास सिजेरियन चीरे (टांकों) पर हल्की खुजली, झुनझुनी या सुन्नता होना सामान्य है। यह त्वचा की नसों के ठीक होने का संकेत है। लेकिन यदि चीरे के आसपास तेज लाली, सूजन, गर्म महसूस होना या मवाद का रिसाव हो, तो तुरंत डॉक्टर को दिखाएं।',
    kn: 'ಸಿ-ಸೆಕ್ಷನ್ ಗಾಯದ ಸುತ್ತ ತುರಿಕೆ ಅಥವಾ ಮರಗಟ್ಟುವಿಕೆ ಕಂಡುಬರುವುದು ಸಹಜ. ಇದು ನರಗಳು ಮತ್ತು ಚರ್ಮವು ಗುಣಮುಖವಾಗುತ್ತಿರುವುದರ ಸಂಕೇತವಾಗಿದೆ. ಆದರೆ ಗಾಯವು ಕೆಂಪಾಗಿ, ಬಿಸಿಯಾಗಿ ಅಥವಾ ಕೀವು ಬಂದರೆ ತಕ್ಷಣ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.',
    es: 'La picazón leve o sensación de hormigueo en la cicatriz de la cesárea alrededor del día 10-14 es normal por la regeneración de las terminaciones nerviosas. Sin embargo, si presenta enrojecimiento creciente, calor, secreción amarillenta o apertura de bordes, acuda a revisión médica.'
  },
  mastitis: {
    en: 'A clogged milk duct is typically a localized, firm, tender lump without systemic fever, often relieved by gentle warmth, chin-to-lump feeding, and cold packs after feeds. Mastitis, conversely, presents with a hard wedge-shaped red quadrant, flu-like body aches, and high fever (>100.4°F / 38°C), requiring prompt evaluation for antibiotic therapy.',
    hi: 'दूध की नली में रुकावट (Clogged Duct) केवल एक जगह पर गांठ के रूप में होती है जिसमें बुखार नहीं होता। जबकि मैस्टाइटिस (Mastitis) में स्तन पर लाल चकत्ते के साथ तेज बुखार (100.4°F से अधिक) और शरीर में कंपकंपी होती है, जिसके लिए एंटीबायोटिक की आवश्यकता होती है।',
    kn: 'ಹಾಲು ಕಟ್ಟಿಕೊಂಡಾಗ (Clogged duct) ಜ್ವರ ಬರುವುದಿಲ್ಲ. ಆದರೆ ಮಾಸ್ಟಿಟಿಸ್ (Mastitis) ಉಂಟಾದರೆ ಸ್ತನದಲ್ಲಿ ತೀವ್ರ ನೋವು, ಕೆಂಪು ಬಣ್ಣ ಮತ್ತು ಜ್ವರ (100.4°F ಗಿಂತ ಹೆಚ್ಚು) ಬರುತ್ತದೆ. ಇದಕ್ಕೆ ವೈದ್ಯರ ಚಿಕಿತ್ಸೆ ಅಗತ್ಯವಿದೆ.',
    es: 'Un conducto obstruido es un bulto localizado y doloroso sin fiebre sistémica. La mastitis, en cambio, se manifiesta con una zona roja en forma de cuña, escalofríos y fiebre alta (>38°C / 100.4°F), requiriendo antibióticos recetados por un médico.'
  },
  core: {
    en: 'To protect your healing abdominal wall and pelvic floor after a Cesarean, always roll onto your side first before pushing up to sit. Engage your breath (exhale on exertion) when lifting baby Aarav, and avoid lifting anything heavier than your infant for the first 6 weeks. A gentle abdominal support wrap can provide proprioceptive comfort.',
    hi: 'सिजेरियन के बाद पेट की मांसपेशियों की सुरक्षा के लिए, बिस्तर से उठते समय पहले करवट लें और फिर हाथों के सहारे उठें। बच्चे को उठाते समय सांस बाहर छोड़ें, और पहले 6 सप्ताह तक बच्चे के वजन से भारी कोई सामान न उठाएं।',
    kn: 'ಸಿ-ಸೆಕ್ಷನ್ ನಂತರ ಎದ್ದೇಳುವಾಗ ಮೊದಲು ಪಕ್ಕಕ್ಕೆ ತಿರುಗಿ ಕೈಗಳ ಸಹಾಯದಿಂದ ಎದ್ದೇಳಿ. ಮಗುವನ್ನು ಎತ್ತುವಾಗ ಆಳವಾದ ಉಸಿರಾಟವನ್ನು ಬಳಸಿ ಮತ್ತು 6 ವಾರಗಳವರೆಗೆ ಹೆಚ್ಚು ಭಾರವಾದ ವಸ್ತುಗಳನ್ನು ಎತ್ತಬೇಡಿ.',
    es: 'Para proteger su abdomen tras una cesárea, gire primero de lado antes de incorporarse. Exhale al levantar a su bebé y evite cargar objetos más pesados que el recién nacido durante las primeras 6 semanas.'
  }
};

const DEFAULT_MESSAGES: AIMessage[] = [
  {
    id: 'ai-init',
    sender: 'assistant',
    content: 'Namaste Priya! I am your MATRIQ Maternal Care Navigator. I have analyzed your Day 12 Cesarean recovery timeline. How can I comfort or guide you today regarding physical recovery, incision care, or infant feeding?',
    timestamp: 'Just now',
    language: 'en'
  }
];

export const AICareNavigator: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const { language, setLanguage, patient, todayMetric } = useRecovery();
  const [messages, setMessages] = useState<AIMessage[]>(DEFAULT_MESSAGES);
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: AIMessage = {
      id: `msg-u-${Date.now()}`,
      sender: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    // Synthesize structured clinical response based on key terms
    setTimeout(() => {
      const qLower = query.toLowerCase();
      let responseBody = '';

      if (qLower.includes('bleed') || qLower.includes('lochia') || qLower.includes('blood')) {
        responseBody = CLINICAL_KNOWLEDGE_BASE.bleeding[language] || CLINICAL_KNOWLEDGE_BASE.bleeding.en;
      } else if (qLower.includes('itch') || qLower.includes('scar') || qLower.includes('incision') || qLower.includes('tingl')) {
        responseBody = CLINICAL_KNOWLEDGE_BASE.itching[language] || CLINICAL_KNOWLEDGE_BASE.itching.en;
      } else if (qLower.includes('mastitis') || qLower.includes('duct') || qLower.includes('breast') || qLower.includes('fever')) {
        responseBody = CLINICAL_KNOWLEDGE_BASE.mastitis[language] || CLINICAL_KNOWLEDGE_BASE.mastitis.en;
      } else if (qLower.includes('lift') || qLower.includes('core') || qLower.includes('walk') || qLower.includes('exercise')) {
        responseBody = CLINICAL_KNOWLEDGE_BASE.core[language] || CLINICAL_KNOWLEDGE_BASE.core.en;
      } else {
        // General supportive clinical response tailored to Day 12
        responseBody = `Thank you for sharing, Priya. On Day ${patient.daysPostpartum} post-Cesarean delivery, your body is balancing tissue remodeling and hormonal transitions. Remember to stay hydrated, rest whenever baby Aarav sleeps, and protect your abdominal incision. Let me know if you would like me to translate this to Hindi, Kannada, or Spanish!`;
      }

      const aiMsg: AIMessage = {
        id: `msg-a-${Date.now()}`,
        sender: 'assistant',
        content: responseBody,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl border-l border-sage-200 flex flex-col animate-slide-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-sage-700 to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl">
            <Sparkles className="w-5 h-5 text-terracotta-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold">MATRIQ AI Navigator</h3>
              <span className="text-[10px] bg-terracotta-500 text-white font-extrabold px-1.5 py-0.2 rounded-full uppercase">
                Gemini 1.5
              </span>
            </div>
            <p className="text-[11px] text-sage-200">Multilingual Maternal Care Companion</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          title="Close Navigator"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Language Switcher Bar */}
      <div className="bg-cream-100 border-b border-cream-300 px-4 py-2 flex items-center justify-between text-xs">
        <span className="text-slate-600 font-semibold flex items-center gap-1.5">
          <Languages className="w-3.5 h-3.5 text-sage-600" /> Language:
        </span>
        <div className="flex items-center gap-1">
          {(['en', 'hi', 'kn', 'es'] as SupportedLanguage[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-bold uppercase transition-all ${
                language === lang
                  ? 'bg-sage-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-cream-200'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-cream-50/50">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-fade-in`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-sage-600 text-white rounded-br-none shadow-sm'
                    : 'bg-white text-slate-800 rounded-bl-none border border-sage-200/80 shadow-card font-medium'
                }`}
              >
                <p className="whitespace-pre-line">{msg.content}</p>

                {/* Mandatory Non-Removable Clinical Disclaimer on AI answers */}
                {!isUser && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-start gap-1.5 text-[10px] text-slate-500 font-normal leading-normal italic select-none">
                    <ShieldAlert className="w-3 h-3 text-terracotta-600 shrink-0 mt-0.5" />
                    <span>
                      MATRIQ provides guidance and trend analysis, not medical diagnosis. Consult your healthcare provider for medical decisions.
                    </span>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-white p-3 rounded-2xl border border-sage-200 w-28 animate-pulse shadow-sm">
            <Bot className="w-4 h-4 text-sage-600" />
            <span>Analyzing...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="p-3 bg-cream-100 border-t border-cream-200">
        <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block mb-1.5">
          Frequently Explored Clinical Topics:
        </span>
        <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
          {SUGGESTED_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="px-2.5 py-1 rounded-xl bg-white hover:bg-cream-50 text-[11px] text-slate-700 font-medium border border-slate-200 transition-all text-left shadow-2xs hover:border-sage-400"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Ask anything in ${language.toUpperCase()}...`}
          className="flex-1 text-xs sm:text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sage-400 bg-cream-50 text-slate-800"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isTyping}
          className="p-3 rounded-xl bg-sage-600 hover:bg-sage-700 text-white disabled:opacity-40 shadow-glow-sage transition-all shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

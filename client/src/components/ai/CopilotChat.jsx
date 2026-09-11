import React, { useState, useEffect, useRef } from 'react';
import { aiApi } from '../../services/ai.api';
import { useAuth } from '../../context/AuthContext';
import { VoiceCopilot } from './VoiceCopilot';
import { 
  Sparkles, Send, Mic, Truck, ShieldCheck, CheckCircle2, 
  AlertTriangle, RefreshCw, Volume2, ArrowRight, MessageSquare, Globe 
} from 'lucide-react';

export const CopilotChat = ({ clientContext = {}, onActionExecuted }) => {
  const { user } = useAuth();
  const userRole = user?.role || 'CARRIER';

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'COPILOT',
      text: userRole === 'SHIPPER' 
        ? 'Namaste! Main BACKTRACKING AI Copilot hoon. Aap bolkar ya likhkar shipment post kar sakte hain, capacity find kar sakte hain, ya rate pooch sakte hain.'
        : 'Ram Ram Bhai! Main BACKTRACKING AI Copilot hoon. "Delhi se Jaipur load dikhao" ya "Iska bhada kitna hai" bol kar dekhein.',
      language: 'hi',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('hi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingConfirmation, setPendingConfirmation] = useState(null);
  const [translationText, setTranslationText] = useState('');
  const [translatedResult, setTranslatedResult] = useState(null);
  const [showTranslator, setShowTranslator] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, pendingConfirmation]);

  const handleSendText = async (textToSend = inputMessage) => {
    if (!textToSend || !textToSend.trim() || isProcessing) return;

    const userMsgObj = {
      id: Date.now().toString(),
      sender: 'USER',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsgObj]);
    setInputMessage('');
    setIsProcessing(true);

    try {
      const res = await aiApi.sendCopilotRequest({
        message: textToSend,
        language: selectedLanguage,
        role: userRole,
        context: clientContext
      });

      if (res.data) {
        const copilotData = res.data;
        const copilotMsgObj = {
          id: (Date.now() + 1).toString(),
          sender: 'COPILOT',
          text: copilotData.response,
          language: copilotData.language || selectedLanguage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionType: copilotData.actionType,
          actionDetails: copilotData.actionDetails
        };

        setMessages(prev => [...prev, copilotMsgObj]);

        if (copilotData.requiresConfirmation && copilotData.confirmButtons) {
          setPendingConfirmation({
            intent: copilotData.intent,
            entities: copilotData.pendingEntities,
            buttons: copilotData.confirmButtons
          });
        } else {
          setPendingConfirmation(null);
        }

        if (copilotData.success && copilotData.actionDetails && onActionExecuted) {
          onActionExecuted(copilotData);
        }
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'COPILOT',
          text: '⚠️ System request error. Kripya dobara try karein.',
          language: 'hi',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmAction = async (confirmed) => {
    if (!pendingConfirmation) return;
    setIsProcessing(true);

    try {
      if (confirmed) {
        const res = await aiApi.sendCopilotRequest({
          confirmAction: true,
          pendingIntent: pendingConfirmation.intent,
          pendingEntities: pendingConfirmation.entities,
          language: selectedLanguage,
          role: userRole,
          context: clientContext
        });

        if (res.data) {
          setMessages(prev => [
            ...prev,
            {
              id: Date.now().toString(),
              sender: 'COPILOT',
              text: res.data.response,
              language: selectedLanguage,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              actionType: res.data.actionType
            }
          ]);
          if (res.data.success && onActionExecuted) {
            onActionExecuted(res.data);
          }
        }
      } else {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: 'COPILOT',
            text: 'Action cancelled.',
            language: selectedLanguage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } catch (e) {
      // Handle error
    } finally {
      setPendingConfirmation(null);
      setIsProcessing(false);
    }
  };

  const handleTranslateBridge = async () => {
    if (!translationText.trim()) return;
    setIsProcessing(true);
    try {
      const targetRole = userRole === 'CARRIER' ? 'SHIPPER' : 'DRIVER';
      const targetLang = userRole === 'CARRIER' ? 'en' : 'hi';
      const res = await aiApi.translateMessage(translationText, targetRole, targetLang);
      if (res.data && res.data.success) {
        setTranslatedResult(res.data.data);
      }
    } catch (e) {
      //
    } finally {
      setIsProcessing(false);
    }
  };

  const quickActions = userRole === 'CARRIER' || userRole === 'DRIVER'
    ? [
        { label: '🚚 Find Jaipur Load', prompt: 'Jaipur wala load dikhao' },
        { label: '💰 How Much Will I Earn?', prompt: 'Is load ka bhada kitna milega?' },
        { label: '✅ Accept Top Load', prompt: 'Jaipur load accept kar do' },
        { label: '📦 Update Space (3T)', prompt: 'Mere truck mein 3 ton jagah hai' },
        { label: '📲 Delivery OTP', prompt: 'Delivery ho gayi' },
        { label: '🌐 Translate Message', action: () => setShowTranslator(!showTranslator) }
      ]
    : [
        { label: '📦 Post Shipment', prompt: 'Mujhe kal Delhi se Jaipur 2.5 ton electronics bhejna hai' },
        { label: '🚚 Find Capacity', prompt: 'Delhi se Jaipur truck capacity dhundo' },
        { label: '📍 Track Shipment', prompt: 'Mera shipment kahan hai' },
        { label: '🌐 Translate for Driver', action: () => setShowTranslator(!showTranslator) }
      ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col h-[650px] font-sans">
      {/* Header */}
      <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-base font-black font-outfit tracking-tight flex items-center gap-2">
              BACKHAULX AI COPILOT
              <span className="bg-blue-500/30 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-400/30">
                MULTILINGUAL
              </span>
            </h3>
            <p className="text-xs text-slate-300 font-normal">
              Speak your language. Move your load.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowTranslator(!showTranslator)}
          className={`text-xs font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all font-outfit cursor-pointer ${
            showTranslator ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
          }`}
        >
          <Globe size={14} /> Translate Bridge
        </button>
      </div>

      {/* Translation Bridge Drawer Panel */}
      {showTranslator && (
        <div className="bg-blue-50 p-4 border-b border-blue-200 text-xs space-y-3">
          <div className="font-bold text-blue-900 font-outfit flex items-center justify-between">
            <span>🌐 Logistics Inter-Party Translation Bridge</span>
            <span className="text-[10px] bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full font-bold">
              {userRole === 'CARRIER' ? 'Driver → Shipper' : 'Shipper → Driver'}
            </span>
          </div>
          <p className="text-slate-600 text-[11px]">
            Speak or type in informal language. AI converts message accurately into formal English or Driver's native language.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={translationText}
              onChange={(e) => setTranslationText(e.target.value)}
              placeholder={userRole === 'CARRIER' ? 'e.g. Bhai traffic hai 20 min late ho jaunga' : 'e.g. Tell him customer can wait until 6:30 PM'}
              className="flex-1 px-3 py-2 bg-white border border-blue-200 rounded-xl text-xs text-slate-900 focus:outline-none"
            />
            <button
              onClick={handleTranslateBridge}
              disabled={isProcessing}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              Translate
            </button>
          </div>
          {translatedResult && (
            <div className="bg-white p-3 rounded-xl border border-blue-200 space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase font-outfit">Translated Message for {userRole === 'CARRIER' ? 'Shipper' : 'Driver'}:</div>
              <div className="text-xs font-bold text-slate-900 font-outfit">"{translatedResult.translatedText}"</div>
            </div>
          )}
        </div>
      )}

      {/* Quick Action Pills */}
      <div className="p-3 bg-slate-50 border-b border-slate-200/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {quickActions.map((qa, idx) => (
          <button
            key={idx}
            onClick={() => qa.action ? qa.action() : handleSendText(qa.prompt)}
            disabled={isProcessing}
            className="shrink-0 bg-white hover:bg-blue-50 hover:border-blue-300 text-slate-700 hover:text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs transition-all font-outfit cursor-pointer"
          >
            {qa.label}
          </button>
        ))}
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-slate-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'USER' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 shadow-2xs space-y-1.5 ${
                msg.sender === 'USER'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white text-slate-900 border border-slate-200 rounded-bl-none'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-[10px] font-bold opacity-75 uppercase font-outfit">
                  {msg.sender === 'USER' ? user?.name || 'You' : 'BACKHAULX Copilot'}
                </span>
                {msg.language && (
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-black/10">
                    {msg.language}
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm font-medium leading-relaxed whitespace-pre-wrap font-outfit">
                {msg.text}
              </p>

              <div className="text-[9px] opacity-60 text-right font-outfit">{msg.timestamp}</div>
            </div>
          </div>
        ))}

        {/* Confirmation Buttons Card */}
        {pendingConfirmation && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl max-w-sm mx-auto shadow-md text-center space-y-3 animate-fade-in">
            <div className="flex items-center justify-center gap-1.5 text-amber-800 font-extrabold text-xs font-outfit">
              <AlertTriangle size={16} className="text-amber-600" /> CONFIRMATION REQUIRED
            </div>
            <p className="text-xs font-semibold text-amber-900 font-outfit">
              This action will safely update real logistics data.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleConfirmAction(true)}
                disabled={isProcessing}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs transition-all font-outfit cursor-pointer"
              >
                YES, ACCEPT
              </button>
              <button
                onClick={() => handleConfirmAction(false)}
                disabled={isProcessing}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs py-2.5 rounded-xl transition-all font-outfit cursor-pointer"
              >
                NO, CANCEL
              </button>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Voice & Input Controls Footer */}
      <div className="p-4 bg-white border-t border-slate-200 space-y-4">
        <VoiceCopilot
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
          onTranscriptComplete={handleSendText}
          isProcessing={isProcessing}
        />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendText();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Speak above or type in Hindi/English/Hinglish..."
            disabled={isProcessing}
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
          />
          <button
            type="submit"
            disabled={isProcessing || !inputMessage.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Loader2, Sparkles, AlertCircle, CheckCircle2, Globe } from 'lucide-react';

export const VoiceCopilot = ({ onTranscriptComplete, selectedLanguage = 'hi', onLanguageChange, isProcessing = false }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;

      // Set language locale based on selection
      const langLocales = {
        'hi': 'hi-IN',
        'en': 'en-IN',
        'hi-en': 'hi-IN',
        'pa': 'pa-IN',
        'mr': 'mr-IN',
        'gu': 'gu-IN'
      };
      recognition.lang = langLocales[selectedLanguage] || 'hi-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
      };

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        if (transcript && transcript.trim()) {
          onTranscriptComplete(transcript);
        }
      };

      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
    }
  }, [selectedLanguage, transcript]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setTranscript('');
      try {
        recognitionRef.current.start();
      } catch (e) {
        // Handle restart
      }
    }
  };

  const handleSpeakText = (textToSpeak) => {
    if (!ttsEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    const langLocales = {
      'hi': 'hi-IN',
      'en': 'en-IN',
      'hi-en': 'hi-IN',
      'pa': 'pa-IN',
      'mr': 'mr-IN',
      'gu': 'gu-IN'
    };
    utterance.lang = langLocales[selectedLanguage] || 'hi-IN';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col items-center space-y-4 text-center">
      {/* Language Selector */}
      <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-full border border-slate-200 text-xs font-bold text-slate-700 font-outfit">
        <Globe size={14} className="text-blue-600 ml-2" />
        <select
          value={selectedLanguage}
          onChange={(e) => onLanguageChange && onLanguageChange(e.target.value)}
          className="bg-transparent border-none font-bold text-slate-800 focus:outline-none cursor-pointer pr-2"
        >
          <option value="hi">🇮🇳 Hindi (हिंदी)</option>
          <option value="hi-en">🇮🇳 Hinglish</option>
          <option value="en">🇬🇧 English</option>
          <option value="pa">🇮🇳 Punjabi (ਪੰਜਾਬੀ)</option>
          <option value="mr">🇮🇳 Marathi (मराठी)</option>
          <option value="gu">🇮🇳 Gujarati (ગુજરાતી)</option>
        </select>

        <button
          type="button"
          onClick={() => setTtsEnabled(!ttsEnabled)}
          className="p-1 rounded-full hover:bg-slate-200 text-slate-600 cursor-pointer"
          title={ttsEnabled ? 'Mute Voice Output' : 'Enable Voice Output'}
        >
          {ttsEnabled ? <Volume2 size={15} className="text-emerald-600" /> : <VolumeX size={15} />}
        </button>
      </div>

      {/* Large Driver-Friendly Voice Button */}
      <div className="relative">
        {isListening && (
          <div className="absolute -inset-3 rounded-full bg-blue-500/20 animate-ping" />
        )}

        <button
          type="button"
          onClick={toggleListening}
          disabled={isProcessing || !speechSupported}
          className={`relative z-10 w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all shadow-xl font-outfit cursor-pointer ${
            isListening
              ? 'bg-red-600 hover:bg-red-700 text-white scale-105 shadow-red-500/30'
              : isProcessing
              ? 'bg-blue-600 text-white opacity-80 cursor-wait'
              : 'bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white hover:scale-105 shadow-blue-500/30'
          }`}
        >
          {isProcessing ? (
            <Loader2 size={36} className="animate-spin" />
          ) : isListening ? (
            <>
              <MicOff size={36} />
              <span className="text-[10px] font-extrabold tracking-wider uppercase mt-1">Tap Stop</span>
            </>
          ) : (
            <>
              <Mic size={36} />
              <span className="text-[10px] font-extrabold tracking-wider uppercase mt-1">Tap Speak</span>
            </>
          )}
        </button>
      </div>

      {/* Live Transcript / Status Indicator */}
      <div className="min-h-[40px] max-w-sm px-4">
        {isListening ? (
          <p className="text-xs font-bold text-blue-600 animate-pulse font-outfit">
            Listening... "{transcript || 'Speak in Hindi/Hinglish...'}"
          </p>
        ) : isProcessing ? (
          <p className="text-xs font-bold text-purple-600 flex items-center justify-center gap-1.5 font-outfit">
            <Sparkles size={14} className="animate-spin" /> BACKTRACKING Copilot processing intent...
          </p>
        ) : transcript ? (
          <p className="text-xs font-semibold text-slate-700 font-outfit italic">
            "{transcript}"
          </p>
        ) : (
          <p className="text-xs font-medium text-slate-400 font-outfit">
            "No English required. Just speak."
          </p>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff, 
  Sparkles, 
  MessageSquare, 
  Send, 
  ShieldCheck, 
  Maximize2, 
  FileText,
  User,
  Clock,
  Sparkle,
  Radio
} from 'lucide-react';
import type { Appointment, UserProfile } from '../types/database';

interface VideoConsultationRoomProps {
  appointment: Appointment;
  currentUser: UserProfile;
  onEndCall: () => void;
  onWritePrescription?: () => void;
}

export const VideoConsultationRoom: React.FC<VideoConsultationRoomProps> = ({
  appointment,
  currentUser,
  onEndCall,
  onWritePrescription,
}) => {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isBlurActive, setIsBlurActive] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    {
      sender: appointment.doctor?.profile?.full_name || 'Dr. Specialist',
      text: 'Namaste! Welcome to your Sankalp consultation. I have reviewed your notes.',
      time: 'Just now',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [callDuration, setCallDuration] = useState(0);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);

  const isDoctor = currentUser.role === 'doctor';
  const partnerName = isDoctor
    ? appointment.patient?.full_name || 'Patient'
    : appointment.doctor?.profile?.full_name || 'Dr. Specialist';

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Attempt to attach real camera stream if available
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (isCameraOn && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((s) => {
          stream = s;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = s;
          }
        })
        .catch((err) => {
          console.log('Using simulated camera preview:', err);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isCameraOn]);

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg = {
      sender: currentUser.full_name,
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setChatInput('');

    // Simulate doctor or patient response
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: partnerName,
          text: isDoctor
            ? 'Thank you Doctor, understood.'
            : 'Noted. Please continue explaining your symptoms.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col font-sans overflow-hidden">
      {/* Top Bar */}
      <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 bg-red-500/20 border border-red-500/40 rounded-full text-red-400 text-xs font-bold">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>LIVE CONSULTATION</span>
          </div>
          <span className="text-slate-400 text-xs hidden sm:inline">|</span>
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Clock className="w-3.5 h-3.5 text-teal-400" />
            <span className="font-mono font-semibold">{formatDuration(callDuration)}</span>
          </div>
        </div>

        <div className="text-center hidden md:block">
          <h2 className="text-sm font-bold text-slate-200">{partnerName}</h2>
          <p className="text-[11px] text-teal-400 font-medium">
            {isDoctor ? 'Patient Visit' : appointment.doctor?.specialization || 'Consultation'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Doctor Write Prescription Trigger */}
          {isDoctor && onWritePrescription && (
            <button
              onClick={onWritePrescription}
              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Write Prescription</span>
            </button>
          )}

          <div className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Encrypted WebRTC</span>
          </div>
        </div>
      </div>

      {/* Main Video Viewport & Optional In-Call Chat */}
      <div className="flex-1 relative flex overflow-hidden">
        {/* Remote Partner Video (Main Stage) */}
        <div className="flex-1 relative bg-slate-900 flex items-center justify-center p-4">
          <div className="relative w-full h-full max-w-4xl max-h-[75vh] rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex items-center justify-center">
            {/* Background Medical Visual Simulation if no remote camera */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex flex-col items-center justify-center p-6 text-center">
              <div className="relative mb-4">
                <img
                  src={
                    isDoctor
                      ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600'
                      : appointment.doctor?.profile?.avatar_url ||
                        'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600'
                  }
                  alt={partnerName}
                  className="w-36 h-36 rounded-full object-cover border-4 border-teal-500/50 shadow-2xl"
                />
                <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-slate-950 rounded-full" />
              </div>
              <h3 className="text-xl font-bold text-white">{partnerName}</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-md">
                {isDoctor
                  ? `Chief Complaint: "${appointment.reason}"`
                  : `${appointment.doctor?.specialization} • ${appointment.doctor?.hospital_affiliation || 'Sankalp Healthcare'}`}
              </p>
            </div>

            {/* In-Video Watermark / Info Badge */}
            <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-semibold text-slate-200">{partnerName}</span>
            </div>
          </div>

          {/* Local User Picture-in-Picture (Patient or Doctor) with Blur Toggle */}
          <div className="absolute bottom-6 right-6 w-40 sm:w-56 aspect-video bg-slate-800 rounded-2xl overflow-hidden border-2 border-teal-500/80 shadow-2xl z-20 group">
            {isCameraOn ? (
              <div className="relative w-full h-full">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${isBlurActive ? 'video-blur-patient' : ''}`}
                />
                {/* Fallback image if camera permission denied in browser */}
                <img
                  src={
                    currentUser.avatar_url ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'
                  }
                  alt="You"
                  className={`absolute inset-0 w-full h-full object-cover -z-10 ${
                    isBlurActive ? 'video-blur-patient' : ''
                  }`}
                />
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-400">
                <VideoOff className="w-6 h-6 text-slate-500 mb-1" />
                <span className="text-[10px]">Camera Off</span>
              </div>
            )}

            {/* Active Blur Indicator */}
            {isBlurActive && (
              <div className="absolute top-2 left-2 px-2 py-0.5 bg-teal-600/90 text-white rounded-md text-[10px] font-bold flex items-center gap-1 shadow">
                <Sparkles className="w-3 h-3" />
                <span>Blur Active</span>
              </div>
            )}

            <div className="absolute bottom-1.5 left-2 text-[10px] text-white/90 font-medium drop-shadow bg-black/40 px-1.5 py-0.5 rounded">
              You ({currentUser.full_name})
            </div>
          </div>
        </div>

        {/* Side In-Call Chat Drawer */}
        {isChatOpen && (
          <div className="w-80 sm:w-96 bg-slate-900 border-l border-slate-800 flex flex-col z-30 animate-fadeIn">
            <div className="p-3.5 bg-slate-800/80 border-b border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-teal-400" />
                <span className="text-xs font-bold text-slate-200">Consultation Chat</span>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                Close
              </button>
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs">
              {chatMessages.map((msg, idx) => {
                const isMe = msg.sender === currentUser.full_name;
                return (
                  <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-0.5">
                      <span className="font-semibold text-slate-300">{msg.sender}</span>
                      <span>• {msg.time}</span>
                    </div>
                    <div
                      className={`px-3 py-2 rounded-2xl max-w-[85%] leading-relaxed ${
                        isMe
                          ? 'bg-teal-600 text-white rounded-tr-none'
                          : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type a message or clinical note..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
              />
              <button
                type="submit"
                className="p-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Bottom Control Dock with Core Patient Blur Feature */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
        {/* Mic Toggle */}
        <button
          onClick={() => setIsMicOn(!isMicOn)}
          className={`p-3.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all shadow-md ${
            isMicOn
              ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
              : 'bg-red-500/20 text-red-400 border border-red-500/50'
          }`}
          title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
        >
          {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          <span className="hidden sm:inline">{isMicOn ? 'Mute' : 'Unmuted'}</span>
        </button>

        {/* Camera Toggle */}
        <button
          onClick={() => setIsCameraOn(!isCameraOn)}
          className={`p-3.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all shadow-md ${
            isCameraOn
              ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
              : 'bg-red-500/20 text-red-400 border border-red-500/50'
          }`}
          title={isCameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
        >
          {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          <span className="hidden sm:inline">{isCameraOn ? 'Stop Video' : 'Start Video'}</span>
        </button>

        {/* CORE REQUIREMENT: "Blur my video" toggle */}
        <button
          onClick={() => setIsBlurActive(!isBlurActive)}
          className={`px-4 py-3.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all shadow-md ${
            isBlurActive
              ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white ring-2 ring-teal-400/50'
              : 'bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30'
          }`}
          title="Patient Privacy: Toggle background and video blur anytime"
        >
          <Sparkles className="w-5 h-5" />
          <span>{isBlurActive ? 'Blur Active (Click to Remove)' : 'Blur My Video'}</span>
        </button>

        {/* Chat Drawer Toggle */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`p-3.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all shadow-md ${
            isChatOpen
              ? 'bg-teal-600 text-white'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="hidden sm:inline">In-Call Chat</span>
        </button>

        {/* End Call Button */}
        <button
          onClick={onEndCall}
          className="px-5 py-3.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-red-600/30 transition-all flex items-center gap-2"
        >
          <PhoneOff className="w-5 h-5" />
          <span>End Consultation</span>
        </button>
      </div>
    </div>
  );
};

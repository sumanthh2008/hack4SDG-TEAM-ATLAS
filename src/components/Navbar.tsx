import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Bell, 
  ShieldAlert, 
  User, 
  Stethoscope, 
  LogOut, 
  ChevronDown, 
  Sparkles, 
  Check, 
  Menu, 
  X,
  Bug,
  HelpCircle,
  Activity,
  Calendar,
  BookOpen,
  FileText
} from 'lucide-react';
import { 
  NotificationService, 
  subscribeToNotifications, 
  AuthService 
} from '../services/supabase';
import type { CurrentSession } from '../services/supabase';
import type { NotificationItem } from '../types/database';

interface NavbarProps {
  currentSession: CurrentSession | null;
  activeView: string;
  onNavigate: (view: string) => void;
  onOpenSOS: () => void;
  onOpenReportError: () => void;
  onOpenAuth: (role?: 'patient' | 'doctor' | 'guest') => void;
  onLogout: () => void;
  onFastRoleSwitch: (role: 'patient' | 'doctor') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentSession,
  activeView,
  onNavigate,
  onOpenSOS,
  onOpenReportError,
  onOpenAuth,
  onLogout,
  onFastRoleSwitch,
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const userId = currentSession?.user?.id || 'patient-demo';
  const userRole = currentSession?.user?.role || 'patient';
  const isGuest = currentSession?.user?.is_anonymous;

  const loadNotifications = () => {
    if (userId) {
      const list = NotificationService.getNotifications(userId);
      setNotifications(list);
    }
  };

  useEffect(() => {
    loadNotifications();
    const unsub = subscribeToNotifications((newNotif) => {
      if (newNotif.user_id === userId) {
        setNotifications((prev) => [newNotif, ...prev]);
      }
    });

    window.addEventListener('sankalp_state_change', loadNotifications);
    return () => {
      unsub();
      window.removeEventListener('sankalp_state_change', loadNotifications);
    };
  }, [userId]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    NotificationService.markAllAsRead(userId);
    loadNotifications();
  };

  const navLinks = [
    { id: 'doctors', label: 'Find Doctors', icon: Stethoscope },
    { id: 'appointments', label: 'My Appointments', icon: Calendar },
    { id: 'recovery', label: 'Recovery Tracker', icon: Activity },
    { id: 'disorders', label: 'Disorders Library', icon: BookOpen },
    { id: 'support', label: 'Support & FAQ', icon: HelpCircle },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-teal-100/70 shadow-sm transition-all">
      {/* Gentle Guest Mode Notice Banner */}
      {isGuest && (
        <div className="bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-500 text-white text-xs py-1.5 px-4 text-center flex items-center justify-center gap-2 font-medium">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>
            You are browsing in <strong>Guest Mode</strong> (Anonymous Session). Consultations & chatbot are active!
          </span>
          <button
            onClick={() => onOpenAuth('patient')}
            className="underline font-bold hover:text-teal-100 ml-1"
          >
            Create Full Account to Save History
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo & Tagline */}
        <div
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#5FB8B0] to-[#2B7871] flex items-center justify-center text-white shadow-md shadow-teal-500/25 group-hover:scale-105 transition-transform">
            <Heart className="w-5 h-5 fill-white/20" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-slate-900 font-heading">
                Sankalp
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#5FB8B0]" />
            </div>
            <p className="text-[10px] text-teal-800/80 font-medium tracking-tight hidden sm:block">
              Your resolve to heal, with care beside you
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-bold text-slate-600">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-teal-50 text-teal-700 font-extrabold shadow-sm'
                    : 'hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4 text-teal-600/80" />
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Section: SOS Button, Notifications, Fast Switcher, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* PERSISTENT EMERGENCY SOS BUTTON (Soft coral, pulse glow) */}
          <button
            onClick={onOpenSOS}
            className="px-3.5 py-2 sm:px-4 sm:py-2.5 bg-gradient-to-r from-[#F07167] to-[#e05b51] hover:from-[#e05b51] hover:to-[#c84940] text-white font-extrabold text-xs rounded-2xl shadow-lg sankalp-coral-glow transition-all flex items-center gap-1.5 animate-pulse-subtle"
            title="Immediate Pan-India Medical & Crisis Helplines"
          >
            <ShieldAlert className="w-4 h-4" />
            <span className="tracking-wide">SOS HELPLINE</span>
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2.5 text-slate-600 hover:text-teal-700 hover:bg-teal-50 rounded-2xl transition-all relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-black flex items-center justify-center animate-ping-once">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown Panel */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-teal-100/80 p-4 z-50 animate-fadeIn space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-slate-800">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 bg-teal-100 text-teal-800 rounded-full text-[10px] font-bold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs text-teal-600 hover:underline font-semibold"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                  {notifications.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-400">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          NotificationService.markAsRead(n.id);
                          loadNotifications();
                          if (n.action_url) {
                            if (n.action_url.includes('recovery')) onNavigate('recovery');
                            else if (n.action_url.includes('doctor')) onNavigate('doctor-portal');
                            else onNavigate('appointments');
                          }
                          setIsNotifOpen(false);
                        }}
                        className={`p-3 rounded-2xl text-xs transition-colors cursor-pointer border ${
                          n.read
                            ? 'bg-slate-50 border-slate-100 text-slate-600'
                            : 'bg-teal-50/70 border-teal-200 text-teal-950 font-medium'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-800 text-xs">{n.title}</span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[11px] leading-relaxed line-clamp-2">{n.body}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Role Switcher for Evaluator Convenience */}
          <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-2xl text-xs font-bold text-slate-600">
            <button
              onClick={() => onFastRoleSwitch('patient')}
              className={`px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
                userRole === 'patient' || userRole === 'guest'
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Patient</span>
            </button>
            <button
              onClick={() => onFastRoleSwitch('doctor')}
              className={`px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
                userRole === 'doctor'
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'hover:text-slate-900'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Doctor</span>
            </button>
          </div>

          {/* User Profile / Auth Button */}
          {currentSession ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 p-1.5 pr-2.5 bg-slate-50 hover:bg-teal-50 rounded-2xl border border-slate-200 transition-colors"
              >
                <img
                  src={
                    currentSession.user.avatar_url ||
                    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200'
                  }
                  alt={currentSession.user.full_name}
                  className="w-7 h-7 rounded-xl object-cover"
                />
                <span className="text-xs font-bold text-slate-700 max-w-[90px] truncate hidden sm:inline">
                  {currentSession.user.full_name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 text-xs text-slate-700 animate-fadeIn space-y-1">
                  <div className="p-2.5 border-b border-slate-100">
                    <span className="block font-bold text-slate-900 truncate">
                      {currentSession.user.full_name}
                    </span>
                    <span className="block text-[10px] text-teal-600 font-semibold uppercase tracking-wider">
                      Role: {currentSession.user.role} {isGuest ? '(Guest)' : ''}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      onOpenReportError();
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 flex items-center gap-2 text-slate-600"
                  >
                    <Bug className="w-4 h-4 text-slate-400" />
                    <span>Report an Issue / Bug</span>
                  </button>

                  <button
                    onClick={() => {
                      onLogout();
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-red-50 text-red-600 flex items-center gap-2 font-semibold"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => onOpenAuth('patient')}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow transition-all"
            >
              Sign In
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 lg:hidden"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white p-4 space-y-3 animate-fadeIn">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    onNavigate(link.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2.5 ${
                    isActive
                      ? 'bg-teal-50 text-teal-700'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4 text-teal-600" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Fast Mode:</span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onFastRoleSwitch('patient');
                  setIsMobileMenuOpen(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                  userRole === 'patient' || userRole === 'guest'
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                Patient
              </button>
              <button
                onClick={() => {
                  onFastRoleSwitch('doctor');
                  setIsMobileMenuOpen(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                  userRole === 'doctor'
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                Doctor
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

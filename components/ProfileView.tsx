import React, { useState } from 'react';
import {
  Bell, Shield, HelpCircle, LogOut,
  ChevronRight, Moon, Globe, FileText, MessageSquare,
  Building2, Mail, Phone, Camera, Check, Edit2, WifiOff, Wifi, HardDrive,
  ChevronLeft, Key, Fingerprint, Smartphone, Lock, Bug, BookOpen, Headphones,
  ExternalLink
} from 'lucide-react';
import { useTheme, useOffline } from '../context';
import StorageManager from './StorageManager';

// Language options
interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'zh', name: 'Simplified Chinese', nativeName: '简体中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
];

interface ProfileViewProps {
  onLogout?: () => void;
}

// User data mock
const mockUser = {
  name: 'Phan Thanh Tung',
  email: 'tung.phan@aecis.vn',
  phone: '+84 123 456 789',
  role: 'Project Manager',
  company: 'AECIS Construction',
  avatar: null as string | null,
  initials: 'PT',
};

// Profile Header with Avatar
const ProfileHeader: React.FC<{ user: typeof mockUser }> = ({ user }) => (
  <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
    <div className="flex items-center gap-4">
      {/* Avatar */}
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#e05530] flex items-center justify-center text-white text-2xl font-bold shadow-lg">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            user.initials
          )}
        </div>
        <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white dark:bg-slate-700 rounded-full shadow-md flex items-center justify-center border border-slate-200 dark:border-slate-600 cursor-pointer active:scale-95 transition-all">
          <Camera size={14} className="text-slate-600 dark:text-slate-300" />
        </button>
      </div>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <h2 className="text-[18px] font-bold text-slate-800 dark:text-slate-100 truncate">{user.name}</h2>
        <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium">{user.role}</p>
        <div className="flex items-center gap-1.5 mt-1">
          <Building2 size={12} className="text-slate-400 dark:text-slate-500" />
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium truncate">{user.company}</span>
        </div>
      </div>

      {/* Edit Button */}
      <button className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center cursor-pointer active:scale-95 transition-all">
        <Edit2 size={18} className="text-slate-600 dark:text-slate-300" />
      </button>
    </div>

    {/* Contact Info */}
    <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-700 grid grid-cols-1 gap-3">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
          <Mail size={16} className="text-blue-500 dark:text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wide">Email</p>
          <p className="text-[13px] text-slate-700 dark:text-slate-200 font-medium truncate">{user.email}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
          <Phone size={16} className="text-emerald-500 dark:text-emerald-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wide">Phone</p>
          <p className="text-[13px] text-slate-700 dark:text-slate-200 font-medium">{user.phone}</p>
        </div>
      </div>
    </div>
  </div>
);

// Menu Section
interface MenuItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  value?: string;
  hasToggle?: boolean;
  toggleValue?: boolean;
  color?: string;
  badge?: string;
}

const MenuSection: React.FC<{
  title: string;
  items: MenuItem[];
  onItemClick?: (id: string) => void;
  onToggle?: (id: string, value: boolean) => void;
}> = ({ title, items, onItemClick, onToggle }) => (
  <div>
    <h3 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 mb-2">
      {title}
    </h3>
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors">
      {items.map((item, index) => (
        <button
          key={item.id}
          onClick={() => item.hasToggle ? onToggle?.(item.id, !item.toggleValue) : onItemClick?.(item.id)}
          className={`w-full flex items-center gap-4 px-4 py-4 text-left transition-colors cursor-pointer active:bg-slate-50 dark:active:bg-slate-700 ${
            index !== items.length - 1 ? 'border-b border-slate-100 dark:border-slate-700' : ''
          }`}
        >
          {/* Icon */}
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color || 'bg-slate-100 dark:bg-slate-700'}`}>
            {item.icon}
          </div>

          {/* Label */}
          <div className="flex-1 min-w-0">
            <span className="text-[14px] font-medium text-slate-800 dark:text-slate-100 block">{item.label}</span>
            {item.subtitle && (
              <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-0.5">{item.subtitle}</span>
            )}
          </div>

          {/* Value / Toggle / Badge */}
          {item.hasToggle ? (
            <div
              className={`relative w-11 h-6 rounded-full transition-colors ${
                item.toggleValue ? 'bg-[#3b82f6]' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  item.toggleValue ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </div>
          ) : item.badge ? (
            <span className="px-2 py-1 bg-[#3b82f6]/10 text-[#3b82f6] text-[10px] font-bold rounded-full">
              {item.badge}
            </span>
          ) : item.value ? (
            <span className="text-[12px] text-slate-400 dark:text-slate-500 font-medium">{item.value}</span>
          ) : (
            <ChevronRight size={18} className="text-slate-300 dark:text-slate-500" />
          )}
        </button>
      ))}
    </div>
  </div>
);

// App Version Footer
const AppVersion: React.FC = () => (
  <div className="mt-8 mb-4 text-center">
    <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">AECIS Mobile</p>
    <p className="text-[10px] text-slate-300 dark:text-slate-600 mt-0.5">Version 2.5.1 (Build 2026.02.08)</p>
  </div>
);

// Language Selector Modal
const LanguageSelector: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: string;
  onSelectLanguage: (code: string) => void;
}> = ({ isOpen, onClose, currentLanguage, onSelectLanguage }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#faf9f6] dark:bg-slate-900 z-[70] flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div
        className="flex-shrink-0 border-b border-slate-100 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="flex items-center px-4 py-3 gap-3">
          <button
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center bg-slate-50 dark:bg-slate-700 rounded-xl active:scale-[0.98] active:bg-slate-100 dark:active:bg-slate-600 transition-all -ml-1 cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6 text-slate-800 dark:text-slate-100" />
          </button>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50 dark:bg-blue-900/30">
            <Globe size={16} className="text-blue-500 dark:text-blue-400" />
          </div>
          <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">Language</h1>
        </div>
      </div>

      {/* Language List */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
          {LANGUAGES.map((lang, index) => {
            const isSelected = currentLanguage === lang.code;
            const isLast = index === LANGUAGES.length - 1;
            return (
              <button
                key={lang.code}
                onClick={() => { onSelectLanguage(lang.code); onClose(); }}
                className={`w-full flex items-center gap-4 px-4 py-4 min-h-[60px] active:scale-[0.98] transition-all text-left cursor-pointer ${
                  isSelected ? 'bg-blue-50/50 dark:bg-blue-900/20' : 'active:bg-slate-50 dark:active:bg-slate-700'
                } ${!isLast ? 'border-b border-slate-50 dark:border-slate-700' : ''}`}
              >
                {/* Flag */}
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-2xl">
                  {lang.flag}
                </div>

                {/* Language Info */}
                <div className="flex-1 min-w-0">
                  <span className={`text-[14px] text-slate-800 dark:text-slate-100 block ${isSelected ? 'font-bold' : 'font-medium'}`}>
                    {lang.name}
                  </span>
                  <span className="text-[12px] text-slate-400 dark:text-slate-500">
                    {lang.nativeName}
                  </span>
                </div>

                {/* Check */}
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-[#3b82f6] flex items-center justify-center">
                    <Check size={14} className="text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Security Settings Modal
const SecuritySettings: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!isOpen) return null;

  if (showChangePassword) {
    return (
      <div className="fixed inset-0 bg-[#faf9f6] dark:bg-slate-900 z-[70] flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div
          className="flex-shrink-0 border-b border-slate-100 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md"
          style={{ paddingTop: 'env(safe-area-inset-top)' }}
        >
          <div className="flex items-center px-4 py-3 gap-3">
            <button
              onClick={() => setShowChangePassword(false)}
              className="w-11 h-11 flex items-center justify-center bg-slate-50 dark:bg-slate-700 rounded-xl active:scale-[0.98] active:bg-slate-100 dark:active:bg-slate-600 transition-all -ml-1 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6 text-slate-800 dark:text-slate-100" />
            </button>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-50 dark:bg-emerald-900/30">
              <Key size={16} className="text-emerald-500 dark:text-emerald-400" />
            </div>
            <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">Change Password</h1>
          </div>
        </div>

        {/* Password Form */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full px-4 py-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6] transition-all"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-4 py-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6] transition-all"
              />
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5">
                Minimum 8 characters with letters, numbers & symbols
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-4 py-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6] transition-all"
              />
            </div>
          </div>
        </div>

        {/* Update Button */}
        <div
          className="flex-shrink-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-700 px-4 py-3"
          style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
        >
          <button
            onClick={() => { setShowChangePassword(false); setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); }}
            disabled={!currentPassword || !newPassword || newPassword !== confirmPassword}
            className={`w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-[0.98] ${
              currentPassword && newPassword && newPassword === confirmPassword
                ? 'bg-[#3b82f6] text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
            }`}
          >
            Update Password
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#faf9f6] dark:bg-slate-900 z-[70] flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div
        className="flex-shrink-0 border-b border-slate-100 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="flex items-center px-4 py-3 gap-3">
          <button
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center bg-slate-50 dark:bg-slate-700 rounded-xl active:scale-[0.98] active:bg-slate-100 dark:active:bg-slate-600 transition-all -ml-1 cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6 text-slate-800 dark:text-slate-100" />
          </button>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-50 dark:bg-emerald-900/30">
            <Shield size={16} className="text-emerald-500 dark:text-emerald-400" />
          </div>
          <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">Security</h1>
        </div>
      </div>

      {/* Security Options */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Password Section */}
        <section>
          <p className="text-[10px] font-extrabold uppercase tracking-tight text-slate-400 dark:text-slate-500 mb-2 px-1">
            Password
          </p>
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
            <button
              onClick={() => setShowChangePassword(true)}
              className="w-full flex items-center gap-4 px-4 py-4 text-left transition-colors cursor-pointer active:bg-slate-50 dark:active:bg-slate-700"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-50 dark:bg-blue-900/30">
                <Key size={20} className="text-blue-500 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[14px] font-medium text-slate-800 dark:text-slate-100 block">Change Password</span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-0.5">Last changed 30 days ago</span>
              </div>
              <ChevronRight size={18} className="text-slate-300 dark:text-slate-500" />
            </button>
          </div>
        </section>

        {/* Authentication Section */}
        <section>
          <p className="text-[10px] font-extrabold uppercase tracking-tight text-slate-400 dark:text-slate-500 mb-2 px-1">
            Authentication
          </p>
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
            {/* Biometric */}
            <button
              onClick={() => setBiometricEnabled(!biometricEnabled)}
              className="w-full flex items-center gap-4 px-4 py-4 text-left transition-colors cursor-pointer active:bg-slate-50 dark:active:bg-slate-700 border-b border-slate-100 dark:border-slate-700"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-purple-50 dark:bg-purple-900/30">
                <Fingerprint size={20} className="text-purple-500 dark:text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[14px] font-medium text-slate-800 dark:text-slate-100 block">Biometric Login</span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-0.5">Use Face ID or fingerprint</span>
              </div>
              <div className={`relative w-11 h-6 rounded-full transition-colors ${biometricEnabled ? 'bg-[#3b82f6]' : 'bg-slate-300 dark:bg-slate-600'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${biometricEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
              </div>
            </button>

            {/* Two-Factor */}
            <button
              onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
              className="w-full flex items-center gap-4 px-4 py-4 text-left transition-colors cursor-pointer active:bg-slate-50 dark:active:bg-slate-700"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-50 dark:bg-amber-900/30">
                <Smartphone size={20} className="text-amber-500 dark:text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[14px] font-medium text-slate-800 dark:text-slate-100 block">Two-Factor Authentication</span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-0.5">Add an extra layer of security</span>
              </div>
              <div className={`relative w-11 h-6 rounded-full transition-colors ${twoFactorEnabled ? 'bg-[#3b82f6]' : 'bg-slate-300 dark:bg-slate-600'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
              </div>
            </button>
          </div>
        </section>

        {/* Session Section */}
        <section>
          <p className="text-[10px] font-extrabold uppercase tracking-tight text-slate-400 dark:text-slate-500 mb-2 px-1">
            Active Sessions
          </p>
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="px-4 py-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                  <Lock size={20} className="text-emerald-500 dark:text-emerald-400" />
                </div>
                <div className="flex-1">
                  <span className="text-[14px] font-medium text-slate-800 dark:text-slate-100 block">Current Device</span>
                  <span className="text-[11px] text-emerald-500 dark:text-emerald-400">Active now</span>
                </div>
              </div>
              <button className="w-full py-2.5 rounded-xl border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-[12px] font-bold active:scale-[0.98] transition-all cursor-pointer">
                Sign Out All Other Devices
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

// Send Feedback Modal
const SendFeedback: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [feedbackType, setFeedbackType] = useState<'suggestion' | 'issue' | 'praise' | 'other'>('suggestion');
  const [feedbackText, setFeedbackText] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const feedbackTypes = [
    { id: 'suggestion', label: 'Suggestion', icon: '💡', color: 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800' },
    { id: 'issue', label: 'Issue', icon: '🐛', color: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800' },
    { id: 'praise', label: 'Praise', icon: '⭐', color: 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800' },
    { id: 'other', label: 'Other', icon: '💬', color: 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600' },
  ];

  const handleSubmit = () => {
    if (!feedbackText.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFeedbackText('');
      setFeedbackType('suggestion');
      onClose();
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-[#faf9f6] dark:bg-slate-900 z-[70] flex flex-col items-center justify-center animate-in fade-in duration-200">
        <div className="text-center px-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
            <Check size={40} className="text-emerald-500 dark:text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Thank You!</h2>
          <p className="text-[14px] text-slate-500 dark:text-slate-400">Your feedback has been submitted successfully.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#faf9f6] dark:bg-slate-900 z-[70] flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div
        className="flex-shrink-0 border-b border-slate-100 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="flex items-center px-4 py-3 gap-3">
          <button
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center bg-slate-50 dark:bg-slate-700 rounded-xl active:scale-[0.98] active:bg-slate-100 dark:active:bg-slate-600 transition-all -ml-1 cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6 text-slate-800 dark:text-slate-100" />
          </button>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-pink-50 dark:bg-pink-900/30">
            <MessageSquare size={16} className="text-pink-500 dark:text-pink-400" />
          </div>
          <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">Send Feedback</h1>
        </div>
      </div>

      {/* Feedback Form */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* Feedback Type */}
        <section className="mb-5">
          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 block">
            What type of feedback?
          </label>
          <div className="grid grid-cols-2 gap-2">
            {feedbackTypes.map(type => (
              <button
                key={type.id}
                onClick={() => setFeedbackType(type.id as typeof feedbackType)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all active:scale-[0.98] cursor-pointer ${
                  feedbackType === type.id
                    ? 'border-[#3b82f6] bg-blue-50 dark:bg-blue-900/20'
                    : type.color
                }`}
              >
                <span className="text-lg">{type.icon}</span>
                <span className={`text-[13px] font-medium ${feedbackType === type.id ? 'text-[#3b82f6]' : 'text-slate-700 dark:text-slate-200'}`}>
                  {type.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Feedback Text */}
        <section className="mb-5">
          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">
            Your Feedback
          </label>
          <textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Tell us what's on your mind..."
            rows={5}
            className="w-full px-4 py-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6] transition-all resize-none"
          />
        </section>

        {/* Email (Optional) */}
        <section className="mb-5">
          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">
            Email (Optional)
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="For follow-up if needed"
            className="w-full px-4 py-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6] transition-all"
          />
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5">
            We'll only use this to respond to your feedback
          </p>
        </section>
      </div>

      {/* Submit Button */}
      <div
        className="flex-shrink-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-700 px-4 py-3"
        style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
      >
        <button
          onClick={handleSubmit}
          disabled={!feedbackText.trim()}
          className={`w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-[0.98] ${
            feedbackText.trim()
              ? 'bg-[#3b82f6] text-white'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
          }`}
        >
          Submit Feedback
        </button>
      </div>
    </div>
  );
};

// Terms & Privacy Modal
const TermsPrivacy: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>('terms');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#faf9f6] dark:bg-slate-900 z-[70] flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div
        className="flex-shrink-0 border-b border-slate-100 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="flex items-center px-4 py-3 gap-3">
          <button
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center bg-slate-50 dark:bg-slate-700 rounded-xl active:scale-[0.98] active:bg-slate-100 dark:active:bg-slate-600 transition-all -ml-1 cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6 text-slate-800 dark:text-slate-100" />
          </button>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-slate-700">
            <FileText size={16} className="text-slate-500 dark:text-slate-400" />
          </div>
          <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">Legal</h1>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 px-4 pb-3">
          <button
            onClick={() => setActiveTab('terms')}
            className={`flex-1 py-2.5 rounded-xl text-[13px] font-bold transition-all active:scale-[0.98] cursor-pointer ${
              activeTab === 'terms'
                ? 'bg-[#3b82f6] text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            Terms of Service
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 py-2.5 rounded-xl text-[13px] font-bold transition-all active:scale-[0.98] cursor-pointer ${
              activeTab === 'privacy'
                ? 'bg-[#3b82f6] text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            Privacy Policy
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4" style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}>
        {activeTab === 'terms' ? (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mb-4">Last updated: February 1, 2026</p>

            <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-100 mb-2">1. Acceptance of Terms</h3>
            <p className="text-[13px] text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
              By accessing and using AECIS Mobile ("the App"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use the App.
            </p>

            <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-100 mb-2">2. Use License</h3>
            <p className="text-[13px] text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
              Permission is granted to temporarily download one copy of the App for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
            </p>

            <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-100 mb-2">3. User Responsibilities</h3>
            <p className="text-[13px] text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
              You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
            </p>

            <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-100 mb-2">4. Data Ownership</h3>
            <p className="text-[13px] text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
              All project data, documents, and files uploaded through the App remain the property of the respective project owners. AECIS acts solely as a data processor.
            </p>

            <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-100 mb-2">5. Limitation of Liability</h3>
            <p className="text-[13px] text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
              AECIS shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your access to or use of the App.
            </p>

            <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-100 mb-2">6. Modifications</h3>
            <p className="text-[13px] text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
              AECIS reserves the right to modify these terms at any time. We will notify users of any material changes via email or in-app notification.
            </p>
          </div>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mb-4">Last updated: February 1, 2026</p>

            <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-100 mb-2">1. Information We Collect</h3>
            <p className="text-[13px] text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
              We collect information you provide directly to us, including name, email address, phone number, company information, and project-related data.
            </p>

            <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-100 mb-2">2. How We Use Your Information</h3>
            <p className="text-[13px] text-slate-600 dark:text-slate-300 mb-2 leading-relaxed">
              We use the information we collect to:
            </p>
            <ul className="text-[13px] text-slate-600 dark:text-slate-300 mb-4 pl-4 space-y-1">
              <li>• Provide, maintain, and improve our services</li>
              <li>• Send you technical notices and support messages</li>
              <li>• Respond to your comments and questions</li>
              <li>• Monitor and analyze usage patterns</li>
            </ul>

            <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-100 mb-2">3. Data Storage & Security</h3>
            <p className="text-[13px] text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
              Your data is stored on secure servers with industry-standard encryption. We implement appropriate security measures to protect against unauthorized access, alteration, or destruction of your data.
            </p>

            <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-100 mb-2">4. Data Sharing</h3>
            <p className="text-[13px] text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
              We do not sell, trade, or rent your personal information to third parties. We may share information with trusted partners who assist us in operating the App, subject to confidentiality agreements.
            </p>

            <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-100 mb-2">5. Your Rights</h3>
            <p className="text-[13px] text-slate-600 dark:text-slate-300 mb-2 leading-relaxed">
              You have the right to:
            </p>
            <ul className="text-[13px] text-slate-600 dark:text-slate-300 mb-4 pl-4 space-y-1">
              <li>• Access your personal data</li>
              <li>• Correct inaccurate data</li>
              <li>• Request deletion of your data</li>
              <li>• Export your data in a portable format</li>
            </ul>

            <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-100 mb-2">6. Contact Us</h3>
            <p className="text-[13px] text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at privacy@aecis.vn
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Help & Support Modal
const HelpSupport: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const supportItems = [
    { id: 'faq', icon: <BookOpen size={20} className="text-blue-500 dark:text-blue-400" />, label: 'FAQ & Guides', subtitle: 'Common questions & tutorials', color: 'bg-blue-50 dark:bg-blue-900/30' },
    { id: 'contact', icon: <Headphones size={20} className="text-emerald-500 dark:text-emerald-400" />, label: 'Contact Support', subtitle: 'Chat or email our team', color: 'bg-emerald-50 dark:bg-emerald-900/30' },
    { id: 'bug', icon: <Bug size={20} className="text-amber-500 dark:text-amber-400" />, label: 'Report a Bug', subtitle: 'Help us improve the app', color: 'bg-amber-50 dark:bg-amber-900/30' },
    { id: 'feedback', icon: <MessageSquare size={20} className="text-pink-500 dark:text-pink-400" />, label: 'Send Feedback', subtitle: 'Share your thoughts', color: 'bg-pink-50 dark:bg-pink-900/30' },
    { id: 'docs', icon: <ExternalLink size={20} className="text-violet-500 dark:text-violet-400" />, label: 'Developer Docs', subtitle: 'API & integration guides', color: 'bg-violet-50 dark:bg-violet-900/30' },
  ];

  return (
    <div className="fixed inset-0 bg-[#faf9f6] dark:bg-slate-900 z-[70] flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div
        className="flex-shrink-0 border-b border-slate-100 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="flex items-center px-4 py-3 gap-3">
          <button
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center bg-slate-50 dark:bg-slate-700 rounded-xl active:scale-[0.98] active:bg-slate-100 dark:active:bg-slate-600 transition-all -ml-1 cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6 text-slate-800 dark:text-slate-100" />
          </button>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-violet-50 dark:bg-violet-900/30">
            <HelpCircle size={16} className="text-violet-500 dark:text-violet-400" />
          </div>
          <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">Help & Support</h1>
        </div>
      </div>

      {/* Support Options */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
          {supportItems.map((item, index) => (
            <button
              key={item.id}
              className={`w-full flex items-center gap-4 px-4 py-4 text-left transition-colors cursor-pointer active:bg-slate-50 dark:active:bg-slate-700 ${
                index !== supportItems.length - 1 ? 'border-b border-slate-100 dark:border-slate-700' : ''
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[14px] font-medium text-slate-800 dark:text-slate-100 block">{item.label}</span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-0.5">{item.subtitle}</span>
              </div>
              <ChevronRight size={18} className="text-slate-300 dark:text-slate-500" />
            </button>
          ))}
        </div>

        {/* Contact Info */}
        <div className="mt-4 bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700">
          <p className="text-[10px] font-extrabold uppercase tracking-tight text-slate-400 dark:text-slate-500 mb-3">
            Contact Information
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[12px] text-slate-600 dark:text-slate-300">
              <Mail size={14} className="text-slate-400 dark:text-slate-500" />
              <span>support@aecis.vn</span>
            </div>
            <div className="flex items-center gap-2 text-[12px] text-slate-600 dark:text-slate-300">
              <Phone size={14} className="text-slate-400 dark:text-slate-500" />
              <span>+84 28 1234 5678</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-3">
            Support hours: Mon-Fri, 8:00 AM - 6:00 PM (GMT+7)
          </p>
        </div>
      </div>
    </div>
  );
};

const ProfileView: React.FC<ProfileViewProps> = ({ onLogout }) => {
  const { isDark, toggleTheme } = useTheme();
  const { isOffline, toggleOfflineMode, syncStatus, storage } = useOffline();
  const [notifications, setNotifications] = useState(true);
  const [isStorageManagerOpen, setIsStorageManagerOpen] = useState(false);
  const [isLanguageSelectorOpen, setIsLanguageSelectorOpen] = useState(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  // Format storage for display
  const formatStorage = (bytes: number): string => {
    return (bytes / (1024 * 1024)).toFixed(0) + ' MB';
  };

  const storageUsageText = `${formatStorage(storage.used)} of ${formatStorage(storage.total)} used`;
  const isStorageWarning = storage.percentage >= storage.warningThreshold;

  const accountItems: MenuItem[] = [
    {
      id: 'offlineMode',
      icon: isOffline
        ? <WifiOff size={20} className="text-amber-500 dark:text-amber-400" />
        : <Wifi size={20} className="text-emerald-500 dark:text-emerald-400" />,
      label: 'Offline Mode',
      subtitle: isOffline
        ? `Working offline${syncStatus.pendingUploads > 0 ? ` · ${syncStatus.pendingUploads} pending` : ''}`
        : 'Switch to work without connection',
      color: isOffline ? 'bg-amber-50 dark:bg-amber-900/30' : 'bg-emerald-50 dark:bg-emerald-900/30',
      hasToggle: true,
      toggleValue: isOffline,
    },
    {
      id: 'storage',
      icon: <HardDrive size={20} className={isStorageWarning ? 'text-amber-500 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'} />,
      label: 'Offline Storage',
      subtitle: storageUsageText,
      color: isStorageWarning ? 'bg-amber-50 dark:bg-amber-900/30' : 'bg-slate-100 dark:bg-slate-700',
      badge: isStorageWarning ? `${storage.percentage}%` : undefined,
    },
    {
      id: 'notifications',
      icon: <Bell size={20} className="text-amber-500 dark:text-amber-400" />,
      label: 'Notifications',
      subtitle: 'Push notifications & alerts',
      color: 'bg-amber-50 dark:bg-amber-900/30',
      hasToggle: true,
      toggleValue: notifications,
    },
    {
      id: 'security',
      icon: <Shield size={20} className="text-emerald-500 dark:text-emerald-400" />,
      label: 'Security',
      subtitle: 'Password & authentication',
      color: 'bg-emerald-50 dark:bg-emerald-900/30',
    },
    {
      id: 'darkMode',
      icon: <Moon size={20} className="text-indigo-500 dark:text-indigo-400" />,
      label: 'Dark Mode',
      color: 'bg-indigo-50 dark:bg-indigo-900/30',
      hasToggle: true,
      toggleValue: isDark,
    },
    {
      id: 'language',
      icon: <Globe size={20} className="text-blue-500 dark:text-blue-400" />,
      label: 'Language',
      value: LANGUAGES.find(l => l.code === currentLanguage)?.name || 'English',
      color: 'bg-blue-50 dark:bg-blue-900/30',
    },
  ];

  const supportItems: MenuItem[] = [
    {
      id: 'help',
      icon: <HelpCircle size={20} className="text-violet-500 dark:text-violet-400" />,
      label: 'Help Center',
      color: 'bg-violet-50 dark:bg-violet-900/30',
    },
    {
      id: 'feedback',
      icon: <MessageSquare size={20} className="text-pink-500 dark:text-pink-400" />,
      label: 'Send Feedback',
      color: 'bg-pink-50 dark:bg-pink-900/30',
    },
    {
      id: 'terms',
      icon: <FileText size={20} className="text-slate-500 dark:text-slate-400" />,
      label: 'Terms & Privacy',
      color: 'bg-slate-100 dark:bg-slate-700',
    },
  ];

  const handleToggle = (id: string, value: boolean) => {
    if (id === 'darkMode') toggleTheme();
    if (id === 'notifications') setNotifications(value);
    if (id === 'offlineMode') toggleOfflineMode();
  };

  const handleItemClick = (id: string) => {
    switch (id) {
      case 'storage':
        setIsStorageManagerOpen(true);
        break;
      case 'language':
        setIsLanguageSelectorOpen(true);
        break;
      case 'security':
        setIsSecurityOpen(true);
        break;
      case 'help':
        setIsHelpOpen(true);
        break;
      case 'feedback':
        setIsFeedbackOpen(true);
        break;
      case 'terms':
        setIsTermsOpen(true);
        break;
      default:
        console.log('Navigate to:', id);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4 pb-24">
        {/* Profile Header */}
        <ProfileHeader user={mockUser} />

        {/* Account Settings */}
        <MenuSection
          title="Account Settings"
          items={accountItems}
          onItemClick={handleItemClick}
          onToggle={handleToggle}
        />

        {/* Support */}
        <MenuSection
          title="Support"
          items={supportItems}
          onItemClick={handleItemClick}
        />

        {/* Logout Button */}
        <div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 font-bold text-[14px] cursor-pointer active:scale-[0.98] transition-all"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* App Version */}
        <AppVersion />
      </div>

      {/* Storage Manager Modal */}
      <StorageManager
        isOpen={isStorageManagerOpen}
        onClose={() => setIsStorageManagerOpen(false)}
      />

      {/* Language Selector Modal */}
      <LanguageSelector
        isOpen={isLanguageSelectorOpen}
        onClose={() => setIsLanguageSelectorOpen(false)}
        currentLanguage={currentLanguage}
        onSelectLanguage={setCurrentLanguage}
      />

      {/* Security Settings Modal */}
      <SecuritySettings
        isOpen={isSecurityOpen}
        onClose={() => setIsSecurityOpen(false)}
      />

      {/* Help & Support Modal */}
      <HelpSupport
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {/* Send Feedback Modal */}
      <SendFeedback
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />

      {/* Terms & Privacy Modal */}
      <TermsPrivacy
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />
    </>
  );
};

export default ProfileView;

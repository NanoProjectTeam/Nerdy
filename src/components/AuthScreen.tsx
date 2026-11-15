'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Sparkles, Shield, Lock, Zap, QrCode } from 'lucide-react';
import { User } from '@/types';
import { AVATAR_DECORATIONS, PROFILE_EFFECTS, UNLOCKED_BADGES } from '@/data/cosmetics';
import { soundManager } from '@/lib/audio';

interface AuthScreenProps {
  onLogin: (user: User) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [authMode, setAuthMode] = useState<'zero' | 'login' | 'register'>('zero');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const handleZeroAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUsername = username.trim() || 'Nerd_' + Math.floor(1000 + Math.random() * 9000);
    const finalDisplayName = displayName.trim() || finalUsername;

    const newUser: User = {
      id: `user-${Date.now()}`,
      username: finalUsername.toLowerCase().replace(/\s+/g, '_'),
      discriminator: String(Math.floor(1000 + Math.random() * 9000)),
      displayName: finalDisplayName,
      avatar: '/mascot.png',
      banner: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
      bio: 'Um, actually... I just joined Nerdy with 0-Auth! All Discord cosmetics are completely free here.',
      pronouns: 'they/them',
      status: 'online',
      customStatus: { emoji: '🤓', text: 'Chilling on Nerdy' },
      avatarDecoration: AVATAR_DECORATIONS[0],
      profileEffect: PROFILE_EFFECTS[0],
      badges: UNLOCKED_BADGES,
      roleColor: '#FEE75C',
      nitroLevel: 'Nerdy Nitro Supreme',
      primaryColor: '#5865F2',
      accentColor: '#FF73FA',
    };

    if (rememberMe) {
      try {
        localStorage.setItem('nerdy_auth_user', JSON.stringify(newUser));
      } catch {}
    }

    soundManager.playSparkle();
    onLogin(newUser);
  };

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUsername = (username || email || 'Nerd').split('@')[0];
    const newUser: User = {
      id: `user-${Date.now()}`,
      username: finalUsername.toLowerCase().replace(/\s+/g, '_'),
      discriminator: '0001',
      displayName: finalUsername,
      avatar: '/mascot.png',
      banner: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
      bio: 'Discord recreated without paywalls. Encrypted & free forever.',
      pronouns: 'he/they',
      status: 'online',
      customStatus: { emoji: '✨', text: 'Online' },
      avatarDecoration: AVATAR_DECORATIONS[1],
      profileEffect: PROFILE_EFFECTS[1],
      badges: UNLOCKED_BADGES,
      roleColor: '#00A8FC',
      nitroLevel: 'Nerdy Nitro Supreme',
    };

    if (rememberMe) {
      try {
        localStorage.setItem('nerdy_auth_user', JSON.stringify(newUser));
      } catch {}
    }

    soundManager.playSparkle();
    onLogin(newUser);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1e1f22] select-none overflow-y-auto">
      {/* Discord Floating Geometric Shapes Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1e1f22] via-[#2b2d31] to-[#111214] pointer-events-none opacity-90" />
      <div className="absolute w-[500px] h-[500px] bg-discord-blurple/10 rounded-full blur-3xl -top-20 -left-20 pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-3xl -bottom-20 -right-20 pointer-events-none" />

      {/* Main Auth Card (Matches Discord Desktop Dimensions) */}
      <div className="relative w-full max-w-[784px] bg-[#313338] rounded-md shadow-2xl p-8 flex flex-col md:flex-row gap-8 text-[#dbdee1] border border-[#232428] z-10 animate-fadeIn">
        {/* Left Pane (Form) */}
        <div className="flex-1 space-y-5">
          {/* Header */}
          <div className="text-center md:text-left space-y-1">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
              <div className="w-9 h-9 rounded-full overflow-hidden bg-discord-blurple p-0.5">
                <Image
                  src="/mascot.png"
                  alt="Nerdy"
                  width={36}
                  height={36}
                  className="w-full h-full object-contain"
                  unoptimized
                />
              </div>
              <span className="font-extrabold text-xl text-white tracking-wide">Nerdy</span>
            </div>
            <h1 className="text-2xl font-bold text-white">
              {authMode === 'register' ? 'Create an account' : 'Welcome back!'}
            </h1>
            <p className="text-sm text-[#949ba4]">
              {authMode === 'zero'
                ? 'Zero-Auth instant login: enter a username to enter right away!'
                : "We're so excited to see you again!"}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#1e1f22] rounded-md text-xs font-semibold">
            <button
              type="button"
              onClick={() => setAuthMode('zero')}
              className={`py-1.5 rounded transition-colors flex items-center justify-center gap-1.5 ${
                authMode === 'zero'
                  ? 'bg-discord-blurple text-white shadow'
                  : 'text-[#949ba4] hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              <span>0-Auth (Instant)</span>
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className={`py-1.5 rounded transition-colors flex items-center justify-center gap-1.5 ${
                authMode === 'login' || authMode === 'register'
                  ? 'bg-discord-blurple text-white shadow'
                  : 'text-[#949ba4] hover:text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Standard Login</span>
            </button>
          </div>

          {/* Form */}
          {authMode === 'zero' ? (
            <form onSubmit={handleZeroAuthSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#b5bac1] uppercase tracking-wider">
                  Pick a Username <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. nerdy_legend"
                  className="w-full bg-[#1e1f22] text-white text-sm p-2.5 rounded border border-transparent focus:border-discord-blurple focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#b5bac1] uppercase tracking-wider">
                  Display Name (Optional)
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Master Nerd 🤓"
                  className="w-full bg-[#1e1f22] text-white text-sm p-2.5 rounded border border-transparent focus:border-discord-blurple focus:outline-none transition-colors"
                />
              </div>

              <div className="flex items-center gap-2 pt-1 text-xs text-[#949ba4]">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-[#1e1f22] border-[#4e5058] text-discord-blurple focus:ring-0"
                />
                <label htmlFor="remember" className="cursor-pointer">
                  Remember this device (auto log in)
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded bg-discord-blurple hover:bg-discord-blurpleHover text-white text-sm font-semibold transition-colors shadow flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span>Enter Nerdy Instantly</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleStandardLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#b5bac1] uppercase tracking-wider">
                  Email or Username <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={email || username}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setUsername(e.target.value);
                  }}
                  placeholder="nerd@example.com"
                  className="w-full bg-[#1e1f22] text-white text-sm p-2.5 rounded border border-transparent focus:border-discord-blurple focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-[#b5bac1] uppercase tracking-wider">
                    Password <span className="text-red-400">*</span>
                  </label>
                  <a href="#" className="text-xs text-[#00a8fc] hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#1e1f22] text-white text-sm p-2.5 rounded border border-transparent focus:border-discord-blurple focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded bg-discord-blurple hover:bg-discord-blurpleHover text-white text-sm font-semibold transition-colors shadow"
              >
                Log In
              </button>

              <div className="text-xs text-[#949ba4] flex items-center gap-1">
                <span>Need an account?</span>
                <button
                  type="button"
                  onClick={() => setAuthMode('zero')}
                  className="text-[#00a8fc] hover:underline"
                >
                  Use 0-Auth Fast Register
                </button>
              </div>
            </form>
          )}

          {/* Encryption Footer Tag */}
          <div className="flex items-center gap-1.5 text-[11px] text-[#949ba4] pt-2 border-t border-[#232428]">
            <Shield className="w-3.5 h-3.5 text-green-400" />
            <span>End-to-End Encrypted (AES-256-GCM) • All Cosmetics 100% Free</span>
          </div>
        </div>

        {/* Right Pane (QR Code Login Simulator) */}
        <div className="hidden md:flex flex-col items-center justify-center p-6 border-l border-[#232428] space-y-4 max-w-[240px] text-center">
          {/* QR Code Container */}
          <div
            onClick={() => {
              const guestUser: User = {
                id: `qr-${Date.now()}`,
                username: 'qr_nerd_' + Math.floor(100 + Math.random() * 900),
                discriminator: '2026',
                displayName: 'Mobile QR User 📱',
                avatar: '/mascot.png',
                banner: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
                bio: 'Logged in via Instant QR Scanner on Nerdy.',
                pronouns: 'they/them',
                status: 'online',
                avatarDecoration: AVATAR_DECORATIONS[0],
                profileEffect: PROFILE_EFFECTS[0],
                badges: UNLOCKED_BADGES,
                nitroLevel: 'Nerdy Nitro Supreme',
              };
              soundManager.playSparkle();
              onLogin(guestUser);
            }}
            className="w-44 h-44 bg-white p-3 rounded-lg shadow-md cursor-pointer hover:scale-105 transition-transform flex flex-col items-center justify-center relative group"
            title="Click to Instant QR Log In"
          >
            {/* Mascot in Center of QR */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-10 h-10 rounded-full bg-white p-0.5 shadow-md">
                <Image
                  src="/mascot.png"
                  alt="Mascot"
                  width={36}
                  height={36}
                  className="w-full h-full object-contain"
                  unoptimized
                />
              </div>
            </div>

            {/* Stylized QR Matrix Pattern */}
            <div className="w-full h-full grid grid-cols-6 grid-rows-6 gap-1 bg-neutral-900 p-2 rounded">
              {Array.from({ length: 36 }).map((_, i) => (
                <div
                  key={i}
                  className={`rounded-[1px] ${
                    i % 2 === 0 || i % 5 === 0 ? 'bg-white' : 'bg-transparent'
                  }`}
                />
              ))}
            </div>

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition-opacity text-white text-xs font-bold">
              Click to Sign In
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="font-bold text-white text-base">Log in with QR Code</h3>
            <p className="text-xs text-[#949ba4] leading-relaxed">
              Scan with the mobile app or click to log in instantly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

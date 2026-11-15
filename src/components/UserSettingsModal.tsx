'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  Sparkles,
  User as UserIcon,
  Palette,
  Mic,
  Volume2,
  Server as ServerIcon,
  Shield,
  Check,
  Zap,
  Radio,
  ExternalLink,
  Flame,
} from 'lucide-react';
import { User, AvatarDecoration, ProfileEffect } from '@/types';
import {
  AVATAR_DECORATIONS,
  PROFILE_EFFECTS,
  UNLOCKED_BADGES,
  CLIENT_THEMES,
  PROFILE_BANNERS,
  SOUNDBOARD_SOUNDS,
} from '@/data/cosmetics';
import { AvatarWithDeco } from './AvatarWithDeco';
import { soundManager } from '@/lib/audio';

interface UserSettingsModalProps {
  currentUser: User;
  onUpdateUser: (updated: Partial<User>) => void;
  onClose: () => void;
  onLogout?: () => void;
  initialTab?: string;
  wispbyteStatus?: { latencyMs: number; status: string; node?: string };
  currentTheme: string;
  onChangeTheme: (themeId: string) => void;
}

export const UserSettingsModal: React.FC<UserSettingsModalProps> = ({
  currentUser,
  onUpdateUser,
  onClose,
  onLogout,
  initialTab = 'nitro',
  currentTheme,
  onChangeTheme,
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [displayName, setDisplayName] = useState(currentUser.displayName);
  const [username, setUsername] = useState(currentUser.username);
  const [bio, setBio] = useState(currentUser.bio);
  const [pronouns, setPronouns] = useState(currentUser.pronouns);
  const [customStatusText, setCustomStatusText] = useState(
    currentUser.customStatus?.text || ''
  );
  const [isMicTesting, setIsMicTesting] = useState(false);
  const [micVolume, setMicVolume] = useState(65);

  const handleSaveProfile = () => {
    onUpdateUser({
      displayName,
      username,
      bio,
      pronouns,
      customStatus: {
        emoji: currentUser.customStatus?.emoji || '🤓',
        text: customStatusText,
      },
    });
    soundManager.playSparkle();
    alert('Profile changes saved successfully!');
  };

  const handleEquipDecoration = (deco: AvatarDecoration) => {
    onUpdateUser({ avatarDecoration: deco });
    soundManager.playSparkle();
    confetti({
      particleCount: 30,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleEquipEffect = (effect: ProfileEffect) => {
    onUpdateUser({ profileEffect: effect });
    soundManager.playSparkle();
    confetti({
      particleCount: 30,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleEquipBanner = (bannerUrl: string) => {
    onUpdateUser({ banner: bannerUrl });
    soundManager.playSparkle();
  };

  return (
    <div className="fixed inset-0 z-50 flex bg-[#313338] text-discord-textNormal select-none animate-fadeIn overflow-hidden">
      {/* Left Sidebar Navigation */}
      <div className="w-60 bg-[#2B2D31] flex justify-end py-14 pr-6 flex-shrink-0 border-r border-[#1F2023]/60 overflow-y-auto no-scrollbar">
        <div className="w-48 space-y-4 text-xs font-semibold">
          {/* USER SETTINGS Header */}
          <div className="space-y-0.5">
            <p className="px-2 py-1 text-[11px] font-bold text-discord-textMuted uppercase tracking-wider">
              User Settings
            </p>
            <button
              onClick={() => setActiveTab('account')}
              className={`w-full text-left px-2.5 py-1.5 rounded flex items-center gap-2 transition-colors ${
                activeTab === 'account'
                  ? 'bg-discord-bgModifierSelected text-white'
                  : 'text-discord-textMuted hover:bg-discord-bgModifierHover hover:text-discord-textNormal'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span>My Account</span>
            </button>
            <button
              onClick={() => setActiveTab('profiles')}
              className={`w-full text-left px-2.5 py-1.5 rounded flex items-center gap-2 transition-colors ${
                activeTab === 'profiles'
                  ? 'bg-discord-bgModifierSelected text-white'
                  : 'text-discord-textMuted hover:bg-discord-bgModifierHover hover:text-discord-textNormal'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Profiles</span>
            </button>
            <button
              onClick={() => setActiveTab('nitro')}
              className={`w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between transition-all ${
                activeTab === 'nitro'
                  ? 'bg-gradient-to-r from-pink-600/40 to-purple-600/40 text-pink-300 font-bold border border-pink-500/30'
                  : 'text-pink-400 hover:bg-discord-bgModifierHover'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span>Nerdy Nitro (Free)</span>
              </div>
              <span className="bg-red-500 text-white text-[9px] px-1 rounded font-bold">
                FREE
              </span>
            </button>
          </div>

          <div className="h-[1px] bg-[#35373C]" />

          {/* APP SETTINGS */}
          <div className="space-y-0.5">
            <p className="px-2 py-1 text-[11px] font-bold text-discord-textMuted uppercase tracking-wider">
              App Settings
            </p>
            <button
              onClick={() => setActiveTab('appearance')}
              className={`w-full text-left px-2.5 py-1.5 rounded flex items-center gap-2 transition-colors ${
                activeTab === 'appearance'
                  ? 'bg-discord-bgModifierSelected text-white'
                  : 'text-discord-textMuted hover:bg-discord-bgModifierHover hover:text-discord-textNormal'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Appearance (12 Themes)</span>
            </button>
            <button
              onClick={() => setActiveTab('voice')}
              className={`w-full text-left px-2.5 py-1.5 rounded flex items-center gap-2 transition-colors ${
                activeTab === 'voice'
                  ? 'bg-discord-bgModifierSelected text-white'
                  : 'text-discord-textMuted hover:bg-discord-bgModifierHover hover:text-discord-textNormal'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>Voice & Video</span>
            </button>
            <button
              onClick={() => setActiveTab('soundboard')}
              className={`w-full text-left px-2.5 py-1.5 rounded flex items-center gap-2 transition-colors ${
                activeTab === 'soundboard'
                  ? 'bg-discord-bgModifierSelected text-white'
                  : 'text-discord-textMuted hover:bg-discord-bgModifierHover hover:text-discord-textNormal'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>Soundboard</span>
            </button>
          </div>

          <div className="h-[1px] bg-[#35373C]" />

          {/* SECURITY & PRIVACY */}
          <div className="space-y-0.5">
            <p className="px-2 py-1 text-[11px] font-bold text-discord-textMuted uppercase tracking-wider">
              Security
            </p>
            <button
              onClick={() => setActiveTab('security')}
              className={`w-full text-left px-2.5 py-1.5 rounded flex items-center gap-2 transition-colors ${
                activeTab === 'security'
                  ? 'bg-discord-bgModifierSelected text-white'
                  : 'text-discord-textMuted hover:bg-discord-bgModifierHover hover:text-discord-textNormal'
              }`}
            >
              <Shield className="w-4 h-4 text-green-400" />
              <span>E2EE Encryption</span>
            </button>
          </div>

          <div className="h-[1px] bg-[#35373C]" />

          {/* LOG OUT BUTTON */}
          <button
            onClick={() => {
              if (onLogout) {
                onLogout();
              }
            }}
            className="w-full text-left px-2.5 py-1.5 rounded text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center gap-2 transition-colors font-semibold"
          >
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 bg-[#313338] py-14 px-10 overflow-y-auto no-scrollbar relative max-w-4xl">
        {/* Close Button / ESC */}
        <div className="fixed top-12 right-12 z-20 flex flex-col items-center">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full border-2 border-discord-textMuted hover:border-white text-discord-textMuted hover:text-white flex items-center justify-center transition-colors"
            title="Close Settings (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="text-[11px] font-bold text-discord-textMuted mt-1">ESC</span>
        </div>

        {/* TAB 1: FREE NERDY NITRO COSMETICS STORE */}
        {activeTab === 'nitro' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Nitro Hero Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-900 via-pink-700 to-amber-600 text-white shadow-xl relative overflow-hidden border border-pink-400/40">
              <div className="relative z-10 max-w-xl space-y-2">
                <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  ALL PAYWALLS BYPASSED • 100% FREE
                </span>
                <h1 className="text-3xl font-extrabold flex items-center gap-2">
                  Nerdy Nitro & Cosmetics Locker <Sparkles className="w-7 h-7 text-yellow-300 animate-spin-slow" />
                </h1>
                <p className="text-sm text-pink-100 leading-relaxed">
                  Every avatar decoration, animated profile effect, 4K 60FPS stream perk, custom theme, and soundboard sound is unlocked and completely free forever. Equip any cosmetic below with one click!
                </p>
              </div>
            </div>

            {/* Section 1: Avatar Decorations */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>Avatar Decorations</span>
                    <span className="bg-pink-500/20 text-pink-300 text-xs px-2 py-0.5 rounded-full border border-pink-500/30">
                      {AVATAR_DECORATIONS.length} Available
                    </span>
                  </h2>
                  <p className="text-xs text-discord-textMuted">
                    Animated frames that wrap around your avatar picture across all servers.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {AVATAR_DECORATIONS.map((deco) => {
                  const isEquipped = currentUser.avatarDecoration?.id === deco.id;
                  return (
                    <div
                      key={deco.id}
                      className={`p-3.5 rounded-xl bg-discord-bgSecondary border transition-all flex flex-col items-center text-center relative group ${
                        isEquipped
                          ? 'border-yellow-400 bg-discord-bgSecondary/90 shadow-[0_0_15px_rgba(250,204,21,0.3)]'
                          : 'border-[#35373C] hover:border-pink-500'
                      }`}
                    >
                      {/* Avatar preview with decoration */}
                      <div className="my-2">
                        <AvatarWithDeco
                          user={{ ...currentUser, avatarDecoration: deco }}
                          size="lg"
                          showStatus={false}
                        />
                      </div>

                      <h3 className="font-bold text-xs text-white mt-1">{deco.name}</h3>
                      <p className="text-[10px] text-discord-textMuted">{deco.category}</p>

                      <button
                        onClick={() => handleEquipDecoration(deco)}
                        className={`w-full mt-3 py-1.5 px-3 rounded text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                          isEquipped
                            ? 'bg-green-600 text-white'
                            : 'bg-discord-blurple hover:bg-discord-blurpleHover text-white group-hover:scale-105'
                        }`}
                      >
                        {isEquipped ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> Equipped
                          </>
                        ) : (
                          'Equip (Free)'
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 2: Profile Effects */}
            <div className="space-y-4 pt-4 border-t border-[#35373C]">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Profile Effects</span>
                  <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-0.5 rounded-full border border-purple-500/30">
                    {PROFILE_EFFECTS.length} Available
                  </span>
                </h2>
                <p className="text-xs text-discord-textMuted">
                  Interactive atmospheric effects that play when anyone clicks your profile.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PROFILE_EFFECTS.map((eff) => {
                  const isEquipped = currentUser.profileEffect?.id === eff.id;
                  return (
                    <div
                      key={eff.id}
                      className={`p-4 rounded-xl bg-discord-bgSecondary border transition-all flex items-center justify-between relative overflow-hidden ${
                        isEquipped
                          ? 'border-pink-400 shadow-[0_0_15px_rgba(244,114,182,0.3)]'
                          : 'border-[#35373C] hover:border-purple-400'
                      }`}
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${eff.gradient} opacity-20 pointer-events-none`}
                      />
                      <div className="relative z-10 space-y-1 max-w-[200px]">
                        <h3 className="font-bold text-xs text-white">{eff.name}</h3>
                        <p className="text-[11px] text-discord-textMuted">{eff.description}</p>
                      </div>

                      <button
                        onClick={() => handleEquipEffect(eff)}
                        className={`relative z-10 py-1.5 px-3 rounded text-xs font-bold transition-all ${
                          isEquipped
                            ? 'bg-green-600 text-white'
                            : 'bg-discord-blurple hover:bg-discord-blurpleHover text-white'
                        }`}
                      >
                        {isEquipped ? 'Equipped' : 'Equip (Free)'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 3: Profile Banners */}
            <div className="space-y-4 pt-4 border-t border-[#35373C]">
              <div>
                <h2 className="text-lg font-bold text-white">Custom Profile Banners</h2>
                <p className="text-xs text-discord-textMuted">
                  High-definition artistic banners for your profile card.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {PROFILE_BANNERS.map((banner) => {
                  const isEquipped = currentUser.banner === banner.url;
                  return (
                    <div
                      key={banner.id}
                      onClick={() => handleEquipBanner(banner.url)}
                      className={`rounded-xl overflow-hidden cursor-pointer border transition-all h-24 relative group ${
                        isEquipped ? 'border-yellow-400 ring-2 ring-yellow-400' : 'border-[#35373C]'
                      }`}
                    >
                      <img
                        src={banner.url}
                        alt={banner.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-end p-2 transition-colors">
                        <span className="text-[10px] font-bold text-white truncate">
                          {banner.name}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROFILES */}
        {activeTab === 'profiles' && (
          <div className="space-y-6 animate-fadeIn">
            <h1 className="text-xl font-bold text-white">Profiles</h1>

            {/* Profile Live Preview Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Form Controls */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-discord-textMuted uppercase">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-discord-bgTertiary text-white text-xs p-2.5 rounded border border-[#1F2023] focus:outline-none focus:border-discord-blurple"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-discord-textMuted uppercase">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-discord-bgTertiary text-white text-xs p-2.5 rounded border border-[#1F2023] focus:outline-none focus:border-discord-blurple"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-discord-textMuted uppercase">
                    Pronouns
                  </label>
                  <input
                    type="text"
                    value={pronouns}
                    onChange={(e) => setPronouns(e.target.value)}
                    placeholder="he/him, she/her, they/them"
                    className="w-full bg-discord-bgTertiary text-white text-xs p-2.5 rounded border border-[#1F2023] focus:outline-none focus:border-discord-blurple"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-discord-textMuted uppercase">
                    Custom Status Text
                  </label>
                  <input
                    type="text"
                    value={customStatusText}
                    onChange={(e) => setCustomStatusText(e.target.value)}
                    className="w-full bg-discord-bgTertiary text-white text-xs p-2.5 rounded border border-[#1F2023] focus:outline-none focus:border-discord-blurple"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-discord-textMuted uppercase">
                    About Me Bio
                  </label>
                  <textarea
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full bg-discord-bgTertiary text-white text-xs p-2.5 rounded border border-[#1F2023] focus:outline-none focus:border-discord-blurple"
                  />
                </div>

                <button
                  onClick={handleSaveProfile}
                  className="py-2 px-5 rounded bg-discord-blurple hover:bg-discord-blurpleHover text-white text-xs font-semibold shadow-md transition-colors"
                >
                  Save Changes
                </button>
              </div>

              {/* Live Preview Card */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-discord-textMuted uppercase">
                  Live Preview
                </span>
                <div className="w-full bg-[#111214] rounded-2xl overflow-hidden shadow-2xl border border-[#232428] text-white">
                  <div className="relative h-24 bg-[#2B2D31]">
                    {currentUser.banner && (
                      <img
                        src={currentUser.banner}
                        alt="Banner"
                        className="w-full h-full object-cover"
                      />
                    )}
                    {currentUser.profileEffect && (
                      <div
                        className={`absolute inset-0 bg-gradient-to-t ${currentUser.profileEffect.gradient} opacity-80`}
                      />
                    )}
                  </div>
                  <div className="px-4 relative -mt-8 flex items-end justify-between">
                    <div className="p-1 bg-[#111214] rounded-full">
                      <AvatarWithDeco user={currentUser} size="lg" />
                    </div>
                    <div className="flex gap-1 mb-2 bg-[#232428] p-1 rounded">
                      {currentUser.badges.slice(0, 4).map((b) => (
                        <span key={b.id} title={b.name}>
                          {b.icon}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 pt-2 space-y-2">
                    <h3 className="font-bold text-base">{displayName}</h3>
                    <p className="text-xs text-discord-textMuted">@{username}</p>
                    <p className="text-xs text-discord-textNormal">{bio}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: APPEARANCE (12 THEMES) */}
        {activeTab === 'appearance' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h1 className="text-xl font-bold text-white">Appearance & Themes</h1>
              <p className="text-xs text-discord-textMuted">
                Choose from 12 Discord themes (normally locked by Nitro).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {CLIENT_THEMES.map((theme) => {
                const isActive = currentTheme === theme.id;
                return (
                  <div
                    key={theme.id}
                    onClick={() => {
                      onChangeTheme(theme.id);
                      soundManager.playSparkle();
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between h-28 relative ${
                      isActive
                        ? 'border-yellow-400 ring-2 ring-yellow-400 shadow-lg'
                        : 'border-[#35373C] hover:border-discord-blurple'
                    }`}
                    style={{ backgroundColor: theme.bgPrimary }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">{theme.name}</span>
                      {isActive && <Check className="w-4 h-4 text-yellow-400" />}
                    </div>

                    <div className="flex gap-1.5 items-center">
                      <span
                        className="w-4 h-4 rounded-full border border-white/20"
                        style={{ backgroundColor: theme.bgSecondary }}
                      />
                      <span
                        className="w-4 h-4 rounded-full border border-white/20"
                        style={{ backgroundColor: theme.bgTertiary }}
                      />
                      <span
                        className="w-4 h-4 rounded-full border border-white/20"
                        style={{ backgroundColor: theme.accent }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: VOICE & VIDEO */}
        {activeTab === 'voice' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h1 className="text-xl font-bold text-white">Voice & Video</h1>
              <p className="text-xs text-discord-textMuted">
                Test your microphone, noise cancellation, and audio devices.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-discord-bgSecondary border border-[#35373C] space-y-4">
              <h3 className="font-bold text-sm text-white">Mic Test</h3>
              <p className="text-xs text-discord-textMuted">
                Click test to check your voice synthesizer & input sensitivity.
              </p>

              {/* Volume Meter */}
              <div className="w-full bg-discord-bgTertiary h-3 rounded-full overflow-hidden flex items-center p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-100 ${
                    isMicTesting ? 'bg-green-500 animate-pulse' : 'bg-gray-600'
                  }`}
                  style={{ width: isMicTesting ? '75%' : '0%' }}
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setIsMicTesting(!isMicTesting);
                    if (!isMicTesting) {
                      soundManager.playVoiceJoin();
                    } else {
                      soundManager.playVoiceLeave();
                    }
                  }}
                  className={`py-2 px-4 rounded text-xs font-bold transition-colors ${
                    isMicTesting
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-discord-blurple hover:bg-discord-blurpleHover text-white'
                  }`}
                >
                  {isMicTesting ? 'Stop Testing' : "Let's Check"}
                </button>
                {isMicTesting && (
                  <span className="text-xs text-green-400 font-semibold flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 animate-pulse" /> Audio active (Wispbyte RTC 14ms)
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SOUNDBOARD */}
        {activeTab === 'soundboard' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h1 className="text-xl font-bold text-white">Soundboard Jam</h1>
              <p className="text-xs text-discord-textMuted">
                Click any sound effect to play it in voice chat and messages.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {SOUNDBOARD_SOUNDS.map((snd) => (
                <button
                  key={snd.id}
                  onClick={() => soundManager.playSound(snd.soundKey)}
                  className="p-3.5 rounded-xl bg-discord-bgSecondary hover:bg-discord-blurple border border-[#35373C] hover:border-discord-blurple text-discord-textNormal hover:text-white transition-all flex flex-col items-center justify-center gap-2 group shadow-sm active:scale-95"
                >
                  <span className="text-2xl group-hover:scale-125 transition-transform">
                    {snd.emoji}
                  </span>
                  <span className="font-bold text-xs">{snd.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TAB: SECURITY & E2EE ENCRYPTION */}
        {activeTab === 'security' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <Shield className="w-6 h-6 text-green-400" />
                  Security & End-to-End Encryption
                </h1>
                <p className="text-xs text-discord-textMuted">
                  Every channel communication is mathematically encrypted on device using AES-256-GCM.
                </p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                ENCRYPTED (AES-256)
              </div>
            </div>

            <div className="p-5 rounded-xl bg-discord-bgSecondary border border-[#35373C] space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded bg-discord-bgTertiary">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Cipher</span>
                  <span className="font-bold text-green-400 text-sm">AES-GCM</span>
                </div>
                <div className="p-3 rounded bg-discord-bgTertiary">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Key Length</span>
                  <span className="font-bold text-white text-sm">256-Bit</span>
                </div>
                <div className="p-3 rounded bg-discord-bgTertiary">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Derivation</span>
                  <span className="font-bold text-white text-sm">PBKDF2-SHA256</span>
                </div>
                <div className="p-3 rounded bg-discord-bgTertiary">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Persistence</span>
                  <span className="font-bold text-pink-400 text-sm">Encrypted DB</span>
                </div>
              </div>

              <div className="p-3 rounded bg-[#111214] text-xs space-y-2 border border-[#232428]">
                <p className="text-white font-semibold">How Nerdy Shields Your Privacy:</p>
                <p className="text-gray-300 leading-relaxed">
                  Before any message is posted, it is converted into ciphertext using a randomly generated 96-bit Initialization Vector (IV). Even if message storage is intercepted, your contents remain fully indecipherable without the local channel cryptographic key.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: MY ACCOUNT */}
        {activeTab === 'account' && (
          <div className="space-y-6 animate-fadeIn">
            <h1 className="text-xl font-bold text-white">My Account</h1>
            <div className="p-4 rounded-xl bg-discord-bgSecondary border border-[#35373C] space-y-4">
              <div className="flex items-center gap-4">
                <AvatarWithDeco user={currentUser} size="lg" />
                <div>
                  <h3 className="font-bold text-base text-white">{currentUser.displayName}</h3>
                  <p className="text-xs text-discord-textMuted">@{currentUser.username}</p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-gradient-to-r from-yellow-500/20 to-amber-500/10 border border-yellow-500/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span className="font-semibold text-white">
                    Nerdy Nitro Supreme Member (Free Lifetime Access)
                  </span>
                </div>
                <span className="bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 rounded">
                  ACTIVE
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

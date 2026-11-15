'use client';

import React from 'react';
import { X, Sparkles, MessageSquare, UserPlus, ShieldCheck, Zap } from 'lucide-react';
import { User } from '@/types';
import { AvatarWithDeco } from './AvatarWithDeco';
import { soundManager } from '@/lib/audio';

interface UserProfileCardProps {
  user: User;
  onClose: () => void;
  onSendMessage?: (userId: string) => void;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({
  user,
  onClose,
  onSendMessage,
}) => {
  const effect = user.profileEffect;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Profile Card Container */}
      <div className="relative w-full max-w-[340px] bg-[#111214] rounded-2xl overflow-hidden shadow-2xl border border-[#232428] z-10 text-white select-none">
        {/* Profile Banner */}
        <div className="relative h-28 w-full bg-[#2B2D31] overflow-hidden">
          {user.banner ? (
            <img
              src={user.banner}
              alt="Profile Banner"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-discord-blurple to-pink-600" />
          )}

          {/* Dynamic Profile Effect Overlay */}
          {effect && (
            <div
              className={`absolute inset-0 bg-gradient-to-t ${effect.gradient} opacity-75 pointer-events-none mix-blend-screen animate-pulse`}
              title={`Profile Effect: ${effect.name}`}
            />
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center text-white/80 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Avatar Positioned Over Banner */}
        <div className="px-4 relative -mt-10 flex items-end justify-between">
          <div className="relative p-1 bg-[#111214] rounded-full">
            <AvatarWithDeco user={user} size="lg" />
          </div>

          {/* Unlocked Badges Bar */}
          <div className="flex items-center gap-1 bg-[#232428]/90 px-2 py-1 rounded-lg border border-[#35373C]/60 mb-2">
            {user.badges.map((badge) => (
              <div
                key={badge.id}
                className="relative group cursor-pointer text-base"
                title={`${badge.name} • ${badge.description}`}
              >
                <span>{badge.icon}</span>
              </div>
            ))}
          </div>
        </div>

        {/* User Identity Details */}
        <div className="p-4 pt-2 space-y-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-1.5 leading-snug">
              {user.displayName}
              {user.isBot && (
                <span className="bg-discord-blurple text-[10px] font-bold px-1.5 py-0.2 rounded uppercase">
                  BOT
                </span>
              )}
            </h2>
            <div className="flex items-center gap-2 text-xs text-discord-textMuted">
              <span>@{user.username}</span>
              {user.pronouns && <span>• {user.pronouns}</span>}
            </div>
          </div>

          {/* Custom Status */}
          {user.customStatus && (
            <div className="text-xs bg-[#232428] p-2 rounded-md border border-[#35373C]/40 flex items-center gap-2">
              <span className="text-sm">{user.customStatus.emoji || '💬'}</span>
              <span className="text-discord-textNormal truncate">
                {user.customStatus.text}
              </span>
            </div>
          )}

          <div className="h-[1px] bg-[#232428]" />

          {/* About Me Section */}
          <div className="space-y-1">
            <h3 className="text-[11px] font-bold text-discord-textMuted uppercase tracking-wider">
              About Me
            </h3>
            <p className="text-xs text-discord-textNormal leading-relaxed whitespace-pre-wrap">
              {user.bio || 'This user has not set a bio yet.'}
            </p>
          </div>

          {/* Free Nitro Subscriber Since Card */}
          <div className="p-2.5 rounded-lg bg-gradient-to-r from-purple-950/40 to-pink-950/40 border border-pink-500/30 flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-pink-400 flex-shrink-0 animate-pulse" />
            <div className="text-xs">
              <p className="font-bold text-pink-300">Nerdy Nitro Subscriber</p>
              <p className="text-[10px] text-gray-400">Since May 13, 2015 • All Perks Unlocked</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => {
                soundManager.playSparkle();
                onClose();
              }}
              className="flex-1 py-1.5 px-3 rounded-md bg-discord-blurple hover:bg-discord-blurpleHover text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-md"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Send Message</span>
            </button>
            <button
              onClick={() => {
                soundManager.playSparkle();
                alert(`Friend request sent to @${user.username}!`);
              }}
              className="py-1.5 px-3 rounded-md bg-[#2B2D31] hover:bg-[#35373C] text-discord-textNormal hover:text-white text-xs font-semibold flex items-center justify-center transition-colors border border-[#35373C]"
              title="Add Friend"
            >
              <UserPlus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

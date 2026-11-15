'use client';

import React, { useState } from 'react';
import {
  ChevronDown,
  Hash,
  Volume2,
  Megaphone,
  Plus,
  Mic,
  MicOff,
  Headphones,
  Settings,
  PhoneOff,
  MonitorUp,
  Video,
  Sparkles,
  Zap,
  Radio,
} from 'lucide-react';
import { Server, Channel, User, OnlineStatus } from '@/types';
import { AvatarWithDeco } from './AvatarWithDeco';
import { soundManager } from '@/lib/audio';

interface ChannelSidebarProps {
  server: Server | null;
  activeChannelId: string;
  onSelectChannel: (channelId: string) => void;
  currentUser: User;
  onUpdateCurrentUser: (updated: Partial<User>) => void;
  onOpenSettings: (tab?: string) => void;
  onOpenCreateChannel: () => void;
  onOpenSoundboard: () => void;
  onOpenScreenShare: () => void;
  currentVoiceChannel: Channel | null;
  onJoinVoice: (channel: Channel) => void;
  onLeaveVoice: () => void;
}

export const ChannelSidebar: React.FC<ChannelSidebarProps> = ({
  server,
  activeChannelId,
  onSelectChannel,
  currentUser,
  onUpdateCurrentUser,
  onOpenSettings,
  onOpenCreateChannel,
  onOpenSoundboard,
  onOpenScreenShare,
  currentVoiceChannel,
  onJoinVoice,
  onLeaveVoice,
}) => {
  const [isServerMenuOpen, setIsServerMenuOpen] = useState(false);
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const toggleCategory = (catId: string) => {
    setCollapsedCategories((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  const handleMuteToggle = () => {
    if (isMuted) {
      soundManager.playUnmute();
      setIsMuted(false);
    } else {
      soundManager.playMute();
      setIsMuted(true);
    }
  };

  const handleDeafenToggle = () => {
    if (isDeafened) {
      soundManager.playUnmute();
      setIsDeafened(false);
    } else {
      soundManager.playMute();
      setIsDeafened(true);
      setIsMuted(true);
    }
  };

  const handleStatusChange = (status: OnlineStatus) => {
    onUpdateCurrentUser({ status });
    setShowStatusMenu(false);
  };

  return (
    <div className="w-60 h-full bg-discord-bgSecondary flex flex-col flex-shrink-0 select-none border-r border-[#1F2023]/60 relative">
      {/* Server Header Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsServerMenuOpen(!isServerMenuOpen)}
          className="w-full h-12 border-b border-[#1F2023] flex items-center justify-between px-4 font-bold text-discord-textHeader hover:bg-discord-bgModifierHover transition-colors shadow-sm"
        >
          <span className="truncate flex items-center gap-2">
            {server ? server.name : 'Nerdy Direct Messages'}
            {server?.boostTier === 3 && (
              <span title="Level 3 Boosted Server (Max Perks!)">
                <Sparkles className="w-4 h-4 text-pink-400 inline" />
              </span>
            )}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-discord-textMuted transition-transform duration-200 ${
              isServerMenuOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Server Dropdown Menu */}
        {isServerMenuOpen && (
          <div className="absolute top-14 left-2 right-2 bg-discord-bgFloating rounded-lg shadow-2xl p-1.5 z-50 border border-[#111214] text-xs font-medium space-y-1">
            <div className="px-2 py-1.5 rounded bg-gradient-to-r from-pink-600/30 to-purple-600/30 text-pink-300 flex items-center justify-between font-bold">
              <span>🚀 Server Boost (Level 3)</span>
              <span className="bg-pink-500 text-white text-[10px] px-1 rounded font-bold">MAX</span>
            </div>
            <button
              onClick={() => {
                setIsServerMenuOpen(false);
                onOpenCreateChannel();
              }}
              className="w-full text-left px-2 py-1.5 rounded hover:bg-discord-blurple hover:text-white text-discord-textNormal flex items-center justify-between transition-colors"
            >
              <span>Create Channel</span>
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setIsServerMenuOpen(false);
                onOpenSettings('server');
              }}
              className="w-full text-left px-2 py-1.5 rounded hover:bg-discord-blurple hover:text-white text-discord-textNormal flex items-center justify-between transition-colors"
            >
              <span>Server Settings</span>
              <Settings className="w-4 h-4" />
            </button>
            <div className="h-[1px] bg-[#35373C] my-1" />
            <button
              onClick={() => {
                setIsServerMenuOpen(false);
                onOpenSettings('nitro');
              }}
              className="w-full text-left px-2 py-1.5 rounded hover:bg-discord-blurple hover:text-white text-pink-400 flex items-center justify-between transition-colors"
            >
              <span>Free Nitro Cosmetics Store</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Channel Categories & List */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4 no-scrollbar">
        {server ? (
          server.categories.map((category) => {
            const isCollapsed = collapsedCategories[category.id];
            return (
              <div key={category.id} className="space-y-0.5">
                {/* Category Header */}
                <div
                  onClick={() => toggleCategory(category.id)}
                  className="flex items-center justify-between px-1 text-[11px] font-bold text-discord-textMuted tracking-wider cursor-pointer group hover:text-discord-textNormal py-1"
                >
                  <div className="flex items-center gap-1">
                    <ChevronDown
                      className={`w-3 h-3 transition-transform duration-200 ${
                        isCollapsed ? '-rotate-90' : ''
                      }`}
                    />
                    <span>{category.name}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenCreateChannel();
                    }}
                    className="opacity-0 group-hover:opacity-100 hover:text-white transition-opacity"
                    title="Create Channel"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Channel Items */}
                {!isCollapsed &&
                  category.channels.map((channel) => {
                    const isActive = activeChannelId === channel.id;
                    const isVoice = channel.type === 'voice';
                    const isInThisVoice = currentVoiceChannel?.id === channel.id;

                    return (
                      <div key={channel.id} className="space-y-1">
                        <button
                          onClick={() => {
                            if (isVoice) {
                              onJoinVoice(channel);
                            } else {
                              onSelectChannel(channel.id);
                            }
                          }}
                          className={`w-full group flex items-center gap-2 px-2 py-1.5 rounded-md text-sm font-medium transition-colors ${
                            isActive
                              ? 'bg-discord-bgModifierSelected text-white'
                              : 'text-discord-textMuted hover:bg-discord-bgModifierHover hover:text-discord-textNormal'
                          }`}
                        >
                          {isVoice ? (
                            <Volume2
                              className={`w-4 h-4 flex-shrink-0 ${
                                isInThisVoice ? 'text-green-400' : 'text-discord-textMuted'
                              }`}
                            />
                          ) : channel.type === 'announcement' ? (
                            <Megaphone className="w-4 h-4 flex-shrink-0 text-discord-textMuted" />
                          ) : (
                            <Hash className="w-4 h-4 flex-shrink-0 text-discord-textMuted" />
                          )}
                          <span className="truncate flex-1 text-left">{channel.name}</span>
                          {isInThisVoice && (
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          )}
                        </button>

                        {/* Connected Voice Members Preview */}
                        {isVoice && isInThisVoice && (
                          <div className="pl-6 space-y-1">
                            <div className="flex items-center justify-between text-xs py-1 px-1.5 rounded bg-[#1E1F22]/40 text-discord-textNormal">
                              <div className="flex items-center gap-2">
                                <AvatarWithDeco user={currentUser} size="sm" showStatus={false} />
                                <span className="font-semibold text-green-400 truncate max-w-[100px]">
                                  {currentUser.displayName}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                {isMuted ? (
                                  <MicOff className="w-3 h-3 text-red-400" />
                                ) : (
                                  <Radio className="w-3 h-3 text-green-400 animate-pulse" />
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            );
          })
        ) : (
          /* Direct Messages Sidebar */
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-discord-textMuted tracking-wider px-2 py-1 uppercase">
              Direct Messages
            </div>
            <button
              onClick={() => onSelectChannel('dm-nerdy')}
              className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-md text-sm font-medium transition-colors ${
                activeChannelId === 'dm-nerdy'
                  ? 'bg-discord-bgModifierSelected text-white'
                  : 'text-discord-textMuted hover:bg-discord-bgModifierHover hover:text-discord-textNormal'
              }`}
            >
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-yellow-400">
                <img src="/mascot.png" alt="Nerdy" className="w-full h-full object-contain" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-white leading-tight">Nerdy Official</p>
                <p className="text-[11px] text-gray-400">Um, actually... everything is free!</p>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Active Voice Connected Box (if joined) */}
      {currentVoiceChannel && (
        <div className="bg-[#18191C] border-t border-[#232428] p-2 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-green-400 animate-bounce" />
              <div>
                <p className="text-xs font-bold text-green-400">Voice Connected</p>
                <p className="text-[10px] text-gray-400 truncate">
                  {currentVoiceChannel.name} • 14ms (384kbps HD)
                </p>
              </div>
            </div>
            <button
              onClick={onLeaveVoice}
              className="p-1.5 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
              title="Disconnect"
            >
              <PhoneOff className="w-4 h-4" />
            </button>
          </div>

          {/* Voice Action Controls (Video, Screen Share, Soundboard) */}
          <div className="grid grid-cols-3 gap-1 pt-1 border-t border-[#2B2D31]">
            <button
              onClick={onOpenScreenShare}
              className="py-1 px-1.5 rounded bg-discord-bgSecondary hover:bg-discord-blurple text-discord-textNormal hover:text-white flex flex-col items-center justify-center text-[10px] gap-0.5 transition-colors"
              title="4K 60FPS Screen Share (Free Nitro)"
            >
              <MonitorUp className="w-3.5 h-3.5" />
              <span>Share 4K</span>
            </button>
            <button
              onClick={onOpenSoundboard}
              className="py-1 px-1.5 rounded bg-discord-bgSecondary hover:bg-discord-blurple text-discord-textNormal hover:text-white flex flex-col items-center justify-center text-[10px] gap-0.5 transition-colors"
              title="Interactive Soundboard"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Soundboard</span>
            </button>
            <button
              onClick={() => alert('Camera enabled in 1080p 60FPS!')}
              className="py-1 px-1.5 rounded bg-discord-bgSecondary hover:bg-discord-blurple text-discord-textNormal hover:text-white flex flex-col items-center justify-center text-[10px] gap-0.5 transition-colors"
              title="Video Camera"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Video</span>
            </button>
          </div>
        </div>
      )}

      {/* User Controls Bar at bottom */}
      <div className="h-[52px] bg-[#232428] px-2 flex items-center justify-between flex-shrink-0 z-30">
        {/* User Avatar + Name + Status Selector */}
        <div className="relative">
          <div
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            className="flex items-center gap-2 p-1 -ml-1 rounded-md hover:bg-discord-bgModifierHover cursor-pointer max-w-[125px]"
          >
            <AvatarWithDeco user={currentUser} size="sm" />
            <div className="overflow-hidden leading-tight">
              <p className="text-xs font-semibold text-white truncate">
                {currentUser.displayName}
              </p>
              <p className="text-[10px] text-discord-textMuted truncate">
                {currentUser.customStatus?.text || `@${currentUser.username}`}
              </p>
            </div>
          </div>

          {/* Online Status Selector Popup */}
          {showStatusMenu && (
            <div className="absolute bottom-12 left-0 w-44 bg-discord-bgFloating rounded-lg shadow-2xl p-1.5 border border-[#111214] z-50 text-xs font-medium space-y-1">
              <div className="text-[10px] font-bold text-discord-textMuted px-2 py-0.5 uppercase">
                Set Online Status
              </div>
              <button
                onClick={() => handleStatusChange('online')}
                className="w-full text-left px-2 py-1.5 rounded hover:bg-discord-blurple hover:text-white flex items-center gap-2 text-discord-textNormal"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span>Online</span>
              </button>
              <button
                onClick={() => handleStatusChange('idle')}
                className="w-full text-left px-2 py-1.5 rounded hover:bg-discord-blurple hover:text-white flex items-center gap-2 text-discord-textNormal"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <span>Idle</span>
              </button>
              <button
                onClick={() => handleStatusChange('dnd')}
                className="w-full text-left px-2 py-1.5 rounded hover:bg-discord-blurple hover:text-white flex items-center gap-2 text-discord-textNormal"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span>Do Not Disturb</span>
              </button>
              <button
                onClick={() => handleStatusChange('offline')}
                className="w-full text-left px-2 py-1.5 rounded hover:bg-discord-blurple hover:text-white flex items-center gap-2 text-discord-textNormal"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-gray-500" />
                <span>Invisible</span>
              </button>
            </div>
          )}
        </div>

        {/* Action icons (Mic, Headphones, Settings) */}
        <div className="flex items-center text-discord-textInteractive">
          <button
            onClick={handleMuteToggle}
            className={`p-1.5 rounded hover:bg-discord-bgModifierHover transition-colors ${
              isMuted ? 'text-red-400' : 'hover:text-white'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
          <button
            onClick={handleDeafenToggle}
            className={`p-1.5 rounded hover:bg-discord-bgModifierHover transition-colors ${
              isDeafened ? 'text-red-400' : 'hover:text-white'
            }`}
            title={isDeafened ? 'Undeafen' : 'Deafen'}
          >
            <Headphones className="w-4 h-4" />
          </button>
          <button
            onClick={() => onOpenSettings()}
            className="p-1.5 rounded hover:bg-discord-bgModifierHover hover:text-white transition-colors"
            title="User Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

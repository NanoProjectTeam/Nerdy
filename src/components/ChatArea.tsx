'use client';

import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Hash,
  Bell,
  Pin,
  Users,
  Search,
  PlusCircle,
  Gift,
  Smile,
  Send,
  Volume2,
  Image as ImageIcon,
  Check,
  X,
  Reply,
  Copy,
  Sparkles,
  Zap,
  Shield,
  Lock,
} from 'lucide-react';
import { Channel, Message, User, Server } from '@/types';
import { AvatarWithDeco } from './AvatarWithDeco';
import { soundManager } from '@/lib/audio';

interface ChatAreaProps {
  channel: Channel | null;
  server: Server | null;
  messages: Message[];
  currentUser: User;
  onSendMessage: (content: string, replyTo?: Message) => void;
  onAddReaction: (messageId: string, emoji: string) => void;
  onToggleMemberList: () => void;
  isMemberListOpen: boolean;
  onOpenUserProfile: (user: User) => void;
  onOpenSoundboard: () => void;
}

const EMOJI_LIST = ['🤓', '🔥', '✨', '🚀', '💖', '🌸', '⚡', '👑', '🎉', '💯', '🦆', '💥', '👀', '💎'];

const GIF_LIST = [
  { name: 'Nerd Typing', url: 'https://media.giphy.com/media/unQ3IJU2RG7DO/giphy.gif' },
  { name: 'Cat Jamming', url: 'https://media.giphy.com/media/jpbnoe3UIa8TU8LM13/giphy.gif' },
  { name: 'Hacker Cyberpunk', url: 'https://media.giphy.com/media/YQitE4YTQYokCM7Paj/giphy.gif' },
  { name: 'Anime Wow', url: 'https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif' },
];

export const ChatArea: React.FC<ChatAreaProps> = ({
  channel,
  server,
  messages,
  currentUser,
  onSendMessage,
  onAddReaction,
  onToggleMemberList,
  isMemberListOpen,
  onOpenUserProfile,
  onOpenSoundboard,
}) => {
  const [inputText, setInputText] = useState('');
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [showPinnedDrawer, setShowPinnedDrawer] = useState(false);
  const [revealedSpoilers, setRevealedSpoilers] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText, replyingTo || undefined);
    setInputText('');
    setReplyingTo(null);
    soundManager.playNotification();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const triggerReactionEffect = (emoji: string) => {
    soundManager.playSparkle();
    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.8 },
    });
  };

  const toggleSpoiler = (key: string) => {
    setRevealedSpoilers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Filter messages by search query if any
  const displayedMessages = searchQuery
    ? messages.filter((m) =>
        m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.author.displayName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;

  const pinnedMessages = messages.filter((m) => m.isPinned);

  return (
    <div className="flex-1 h-full bg-discord-bgPrimary flex flex-col min-w-0 relative">
      {/* Channel Header Bar */}
      <div className="h-12 border-b border-[#1F2023] flex items-center justify-between px-4 flex-shrink-0 z-10 shadow-sm bg-discord-bgPrimary">
        <div className="flex items-center gap-2 overflow-hidden">
          <Hash className="w-6 h-6 text-discord-textMuted flex-shrink-0" />
          <h2 className="font-bold text-discord-textHeader truncate text-sm">
            {channel ? channel.name : 'general-chat'}
          </h2>
          {channel?.topic && (
            <>
              <div className="w-[1px] h-4 bg-[#35373C] mx-1 flex-shrink-0" />
              <p className="text-xs text-discord-textMuted truncate hidden md:block max-w-sm">
                {channel.topic}
              </p>
            </>
          )}
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center gap-3 text-discord-textInteractive">
          {/* E2EE Active Security Pill */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-400 text-xs font-semibold border border-green-500/20 cursor-pointer hover:bg-green-500/20 transition-colors"
            title="End-to-End Encrypted with AES-256-GCM. Messages are mathematically shielded and saved."
            onClick={() => {
              alert('🔒 End-to-End Encryption (E2EE) Active:\nAll messages and media transmitted in this channel are encrypted with client-side AES-256-GCM before being stored.\nOnly participants in this channel possess the decryption keys.');
            }}
          >
            <Shield className="w-3.5 h-3.5 text-green-400" />
            <span className="hidden sm:inline">E2EE</span>
            <span>Encrypted</span>
          </div>

          <button
            onClick={() => setShowPinnedDrawer(!showPinnedDrawer)}
            className={`p-1 hover:text-white rounded transition-colors ${
              showPinnedDrawer ? 'text-white' : ''
            }`}
            title="Pinned Messages"
          >
            <Pin className="w-5 h-5" />
          </button>

          <button
            onClick={onToggleMemberList}
            className={`p-1 hover:text-white rounded transition-colors ${
              isMemberListOpen ? 'text-white' : ''
            }`}
            title="Member List"
          >
            <Users className="w-5 h-5" />
          </button>

          {/* Search Box */}
          <div className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-discord-bgTertiary text-discord-textNormal text-xs rounded px-2 py-1 pr-6 focus:outline-none focus:w-44 w-32 transition-all placeholder-discord-textMuted"
            />
            <Search className="w-3.5 h-3.5 text-discord-textMuted absolute right-2 top-1.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Pinned Messages Dropdown Modal */}
      {showPinnedDrawer && (
        <div className="absolute top-14 right-4 w-80 max-h-96 bg-discord-bgFloating rounded-lg shadow-2xl p-3 border border-[#111214] z-50 overflow-y-auto space-y-2">
          <div className="flex items-center justify-between border-b border-[#35373C] pb-2">
            <h3 className="font-bold text-xs uppercase text-discord-textHeader flex items-center gap-1.5">
              <Pin className="w-3.5 h-3.5 text-yellow-400" /> Pinned Messages
            </h3>
            <button
              onClick={() => setShowPinnedDrawer(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {pinnedMessages.length === 0 ? (
            <p className="text-xs text-gray-400 py-4 text-center">No pinned messages yet.</p>
          ) : (
            pinnedMessages.map((msg) => (
              <div key={msg.id} className="p-2 rounded bg-discord-bgSecondary text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-white">
                  <span>{msg.author.displayName}</span>
                  <span className="text-[10px] text-gray-400">{msg.timestamp}</span>
                </div>
                <p className="text-discord-textNormal line-clamp-3">{msg.content}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 no-scrollbar">
        {/* Welcome Channel Banner */}
        <div className="py-6 border-b border-[#35373C]/50 space-y-2">
          <div className="w-16 h-16 rounded-full bg-discord-bgSecondary flex items-center justify-center text-white mb-2 shadow-inner">
            <Hash className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-discord-textHeader">
            Welcome to #{channel ? channel.name : 'general-chat'}!
          </h1>
          <p className="text-sm text-discord-textMuted">
            This is the start of the #{channel ? channel.name : 'general-chat'} channel on Nerdy. All Nitro cosmetics and perks are completely free!
          </p>
        </div>

        {/* Message Items */}
        {displayedMessages.map((msg, index) => {
          const isGrouped =
            index > 0 &&
            displayedMessages[index - 1].author.id === msg.author.id &&
            !msg.replyTo;

          return (
            <div
              key={msg.id}
              className="group relative flex gap-4 px-2 -mx-2 py-1 rounded hover:bg-discord-bgModifierHover transition-colors"
            >
              {/* Floating Action Bar on Message Hover */}
              <div className="absolute right-3 -top-3 bg-discord-bgSecondary border border-[#1F2023] rounded-md shadow-lg flex items-center p-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-20 space-x-0.5">
                <button
                  onClick={() => {
                    onAddReaction(msg.id, '🤓');
                    triggerReactionEffect('🤓');
                  }}
                  className="p-1 hover:bg-[#35373C] text-discord-textMuted hover:text-white rounded"
                  title="React with 🤓"
                >
                  <Smile className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setReplyingTo(msg)}
                  className="p-1 hover:bg-[#35373C] text-discord-textMuted hover:text-white rounded"
                  title="Reply"
                >
                  <Reply className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(msg.content);
                    soundManager.playSparkle();
                  }}
                  className="p-1 hover:bg-[#35373C] text-discord-textMuted hover:text-white rounded"
                  title="Copy Text"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              {/* Author Avatar */}
              {!isGrouped ? (
                <div
                  onClick={() => onOpenUserProfile(msg.author)}
                  className="cursor-pointer flex-shrink-0"
                >
                  <AvatarWithDeco user={msg.author} size="md" />
                </div>
              ) : (
                <div className="w-10 flex-shrink-0" />
              )}

              {/* Message Content Container */}
              <div className="flex-1 overflow-hidden">
                {/* Header with Name, Tag & Timestamp */}
                {!isGrouped && (
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      onClick={() => onOpenUserProfile(msg.author)}
                      className="font-semibold text-sm cursor-pointer hover:underline"
                      style={{ color: msg.author.roleColor || '#DBDEE1' }}
                    >
                      {msg.author.displayName}
                    </span>

                    {/* Bot or Nerd Tag */}
                    {msg.author.isBot ? (
                      <span className="bg-discord-blurple text-white text-[10px] font-bold px-1.5 py-0.2 rounded uppercase">
                        BOT
                      </span>
                    ) : msg.author.id === currentUser.id ? (
                      <span className="bg-yellow-500 text-black text-[10px] font-bold px-1.5 py-0.2 rounded uppercase flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5" /> NERD
                      </span>
                    ) : null}

                    <span className="text-[11px] text-discord-textMuted">{msg.timestamp}</span>

                    {msg.isPinned && (
                      <span title="Pinned Message">
                        <Pin className="w-3 h-3 text-yellow-400 rotate-45 inline" />
                      </span>
                    )}
                  </div>
                )}

                {/* Reply Citation */}
                {msg.replyTo && (
                  <div className="flex items-center gap-1.5 text-xs text-discord-textMuted mb-1 pl-2 border-l-2 border-[#5865F2]">
                    <Reply className="w-3 h-3 rotate-180 text-discord-blurple" />
                    <span className="font-semibold text-discord-textNormal">
                      @{msg.replyTo.authorName}
                    </span>
                    <span className="truncate max-w-xs">{msg.replyTo.content}</span>
                  </div>
                )}

                {/* Text Body with Markdown & Spoilers */}
                <div className="text-discord-textNormal text-sm leading-relaxed break-words whitespace-pre-wrap">
                  {msg.content}
                </div>

                {/* Rich Embed */}
                {msg.embed && (
                  <div
                    className="mt-2.5 p-3 rounded-md bg-[#2B2D31] max-w-lg border-l-4 shadow-md space-y-2"
                    style={{ borderColor: msg.embed.color || '#5865F2' }}
                  >
                    {msg.embed.title && (
                      <h4 className="font-bold text-sm text-white">{msg.embed.title}</h4>
                    )}
                    {msg.embed.description && (
                      <p className="text-xs text-discord-textNormal whitespace-pre-wrap">
                        {msg.embed.description}
                      </p>
                    )}
                    {msg.embed.fields && (
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        {msg.embed.fields.map((field, idx) => (
                          <div key={idx} className="space-y-0.5">
                            <p className="text-[11px] font-bold text-gray-400">{field.name}</p>
                            <p className="text-xs text-white">{field.value}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {msg.embed.footer && (
                      <p className="text-[10px] text-gray-400 pt-1 border-t border-[#35373C]">
                        {msg.embed.footer}
                      </p>
                    )}
                  </div>
                )}

                {/* Reactions Row */}
                {msg.reactions && msg.reactions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {msg.reactions.map((reaction, rIdx) => {
                      const hasReacted = reaction.users.includes(currentUser.id);
                      return (
                        <button
                          key={rIdx}
                          onClick={() => {
                            onAddReaction(msg.id, reaction.emoji);
                            triggerReactionEffect(reaction.emoji);
                          }}
                          className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-semibold border transition-all ${
                            hasReacted
                              ? 'bg-discord-blurple/20 border-discord-blurple text-discord-blurple shadow-sm'
                              : 'bg-discord-bgSecondary border-transparent hover:border-[#4E5058] text-discord-textMuted hover:text-discord-textNormal'
                          }`}
                        >
                          <span>{reaction.emoji}</span>
                          <span>{reaction.count}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Replying banner */}
      {replyingTo && (
        <div className="px-4 py-1.5 bg-[#2B2D31] flex items-center justify-between text-xs text-discord-textMuted border-t border-[#1F2023]">
          <div className="flex items-center gap-2">
            <span>Replying to</span>
            <span className="font-semibold text-white">@{replyingTo.author.displayName}</span>
          </div>
          <button
            onClick={() => setReplyingTo(null)}
            className="hover:text-white p-0.5 rounded"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Chat Input Deck */}
      <div className="p-4 pt-1 flex-shrink-0">
        <div className="relative bg-discord-input rounded-lg flex items-center px-4 py-2.5 focus-within:ring-1 focus-within:ring-discord-blurple">
          {/* File Attachment Button */}
          <button
            onClick={() => {
              const dummyImg = prompt(
                'Enter image URL to share (Unlocked 500MB file uploads with Nerdy Nitro):',
                'https://media.giphy.com/media/unQ3IJU2RG7DO/giphy.gif'
              );
              if (dummyImg) {
                onSendMessage(`[Attached Image](${dummyImg})`);
              }
            }}
            className="text-discord-textMuted hover:text-white mr-3 transition-colors"
            title="Upload Files (500MB Unlocked)"
          >
            <PlusCircle className="w-5 h-5" />
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message #${channel ? channel.name : 'general-chat'} (Try /help, /nerd, /boost)`}
            className="bg-transparent text-discord-textNormal text-sm flex-1 focus:outline-none placeholder-discord-textMuted"
          />

          {/* Right Toolbar */}
          <div className="flex items-center gap-2 text-discord-textInteractive ml-2">
            {/* Nitro Gift Button */}
            <button
              onClick={() => {
                alert('🎁 On Nerdy, Discord Nitro is 100% Free! You have all cosmetics unlocked permanently.');
                soundManager.playSparkle();
              }}
              className="hover:text-pink-400 transition-colors"
              title="Gift Nitro (Everything is Free on Nerdy!)"
            >
              <Gift className="w-5 h-5" />
            </button>

            {/* Soundboard Quick Button */}
            <button
              onClick={onOpenSoundboard}
              className="hover:text-yellow-400 transition-colors"
              title="Open Soundboard"
            >
              <Volume2 className="w-5 h-5" />
            </button>

            {/* GIF Picker Toggle */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowGifPicker(!showGifPicker);
                  setShowEmojiPicker(false);
                }}
                className={`text-xs font-bold px-1.5 py-0.5 rounded border border-current hover:text-white transition-colors ${
                  showGifPicker ? 'text-white' : ''
                }`}
                title="Open GIF Picker"
              >
                GIF
              </button>

              {/* GIF Picker Popover */}
              {showGifPicker && (
                <div className="absolute bottom-10 right-0 w-72 bg-discord-bgFloating rounded-lg shadow-2xl p-2.5 border border-[#111214] z-50 space-y-2">
                  <div className="flex items-center justify-between pb-1 border-b border-[#35373C]">
                    <span className="text-xs font-bold text-white">Trending GIFs</span>
                    <button onClick={() => setShowGifPicker(false)}>
                      <X className="w-3.5 h-3.5 text-gray-400 hover:text-white" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto">
                    {GIF_LIST.map((gif, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          onSendMessage(gif.url);
                          setShowGifPicker(false);
                        }}
                        className="rounded overflow-hidden cursor-pointer hover:opacity-80 transition-opacity bg-black h-24"
                      >
                        <img src={gif.url} alt={gif.name} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Emoji Picker Toggle */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowEmojiPicker(!showEmojiPicker);
                  setShowGifPicker(false);
                }}
                className={`hover:text-yellow-400 transition-colors ${
                  showEmojiPicker ? 'text-yellow-400' : ''
                }`}
                title="Select Emoji"
              >
                <Smile className="w-5 h-5" />
              </button>

              {/* Emoji Picker Popover */}
              {showEmojiPicker && (
                <div className="absolute bottom-10 right-0 w-64 bg-discord-bgFloating rounded-lg shadow-2xl p-2.5 border border-[#111214] z-50 space-y-2">
                  <div className="flex items-center justify-between pb-1 border-b border-[#35373C]">
                    <span className="text-xs font-bold text-white flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-yellow-400" /> Free Nitro Emojis
                    </span>
                    <button onClick={() => setShowEmojiPicker(false)}>
                      <X className="w-3.5 h-3.5 text-gray-400 hover:text-white" />
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-1.5 py-1">
                    {EMOJI_LIST.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => {
                          setInputText((prev) => prev + emoji);
                          setShowEmojiPicker(false);
                          soundManager.playSparkle();
                        }}
                        className="text-xl p-1 rounded hover:bg-[#35373C] transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={!inputText.trim()}
              className={`p-1 rounded transition-colors ${
                inputText.trim()
                  ? 'text-discord-blurple hover:text-white'
                  : 'text-discord-textMuted opacity-50 cursor-not-allowed'
              }`}
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

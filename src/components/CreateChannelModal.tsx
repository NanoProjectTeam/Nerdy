'use client';

import React, { useState } from 'react';
import { X, Hash, Volume2, Megaphone } from 'lucide-react';
import { Channel } from '@/types';
import { soundManager } from '@/lib/audio';

interface CreateChannelModalProps {
  onClose: () => void;
  onCreateChannel: (channel: Channel) => void;
}

export const CreateChannelModal: React.FC<CreateChannelModalProps> = ({
  onClose,
  onCreateChannel,
}) => {
  const [channelType, setChannelType] = useState<'text' | 'voice' | 'announcement'>('text');
  const [channelName, setChannelName] = useState('');
  const [topic, setTopic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelName.trim()) return;

    const formattedName = channelName.toLowerCase().replace(/\s+/g, '-');
    const newChannel: Channel = {
      id: `c-${Date.now()}`,
      name: formattedName,
      type: channelType,
      topic: topic || undefined,
    };

    onCreateChannel(newChannel);
    soundManager.playSparkle();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-discord-bgSecondary rounded-2xl overflow-hidden shadow-2xl border border-[#35373C] z-10 text-white p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#35373C] pb-3">
          <h2 className="text-base font-bold text-white">Create Channel</h2>
          <button
            onClick={onClose}
            className="text-discord-textMuted hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Channel Type */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-discord-textMuted uppercase tracking-wider">
              Channel Type
            </label>
            <div className="space-y-2">
              <label
                onClick={() => setChannelType('text')}
                className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                  channelType === 'text'
                    ? 'bg-discord-bgTertiary border-discord-blurple text-white'
                    : 'bg-[#232428] border-transparent text-discord-textMuted hover:text-white'
                }`}
              >
                <Hash className="w-5 h-5" />
                <div>
                  <p className="text-xs font-bold text-white">Text</p>
                  <p className="text-[11px] text-gray-400">Post messages, images, memes, and code</p>
                </div>
              </label>

              <label
                onClick={() => setChannelType('voice')}
                className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                  channelType === 'voice'
                    ? 'bg-discord-bgTertiary border-discord-blurple text-white'
                    : 'bg-[#232428] border-transparent text-discord-textMuted hover:text-white'
                }`}
              >
                <Volume2 className="w-5 h-5" />
                <div>
                  <p className="text-xs font-bold text-white">Voice</p>
                  <p className="text-[11px] text-gray-400">Hang out with voice, video, and screen share</p>
                </div>
              </label>
            </div>
          </div>

          {/* Channel Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-discord-textMuted uppercase tracking-wider">
              Channel Name
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-gray-400 text-sm">#</span>
              <input
                type="text"
                required
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                placeholder="new-channel"
                className="w-full bg-discord-bgTertiary text-white text-xs pl-7 pr-3 py-2.5 rounded-lg border border-[#1F2023] focus:outline-none focus:border-discord-blurple"
              />
            </div>
          </div>

          {/* Topic */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-discord-textMuted uppercase tracking-wider">
              Channel Topic (Optional)
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="What is this channel about?"
              className="w-full bg-discord-bgTertiary text-white text-xs p-2.5 rounded-lg border border-[#1F2023] focus:outline-none focus:border-discord-blurple"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 rounded text-xs font-semibold text-white hover:underline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!channelName.trim()}
              className="py-2 px-5 rounded bg-discord-blurple hover:bg-discord-blurpleHover text-white text-xs font-bold disabled:opacity-50 transition-colors shadow-md"
            >
              Create Channel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

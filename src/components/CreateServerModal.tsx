'use client';

import React, { useState } from 'react';
import { X, Sparkles, Upload } from 'lucide-react';
import { Server } from '@/types';
import { soundManager } from '@/lib/audio';

interface CreateServerModalProps {
  onClose: () => void;
  onCreateServer: (server: Server) => void;
}

export const CreateServerModal: React.FC<CreateServerModalProps> = ({
  onClose,
  onCreateServer,
}) => {
  const [serverName, setServerName] = useState('');
  const [serverDescription, setServerDescription] = useState('');
  const [iconUrl, setIconUrl] = useState('');

  const sampleIcons = [
    '/mascot.png',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=80',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serverName.trim()) return;

    const newServer: Server = {
      id: `server-${Date.now()}`,
      name: serverName,
      icon: iconUrl || sampleIcons[0],
      description: serverDescription || 'A custom community server powered by Nerdy.',
      boostTier: 3,
      boostCount: 30, // Free Level 3 boost unlocked!
      roles: [
        { id: 'r-admin', name: '👑 Admin', color: '#FEE75C', hoist: true },
        { id: 'r-member', name: 'Nerds', color: '#949BA4', hoist: false },
      ],
      categories: [
        {
          id: `cat-${Date.now()}-1`,
          name: 'TEXT CHANNELS',
          channels: [
            { id: `c-${Date.now()}-gen`, name: 'general', type: 'text', topic: 'General discussion' },
          ],
        },
        {
          id: `cat-${Date.now()}-2`,
          name: 'VOICE CHANNELS',
          channels: [
            { id: `c-${Date.now()}-voice`, name: 'Lobby Voice', type: 'voice' },
          ],
        },
      ],
      members: [],
    };

    onCreateServer(newServer);
    soundManager.playSparkle();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-discord-bgSecondary rounded-2xl overflow-hidden shadow-2xl border border-[#35373C] z-10 text-white p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#35373C] pb-3">
          <div className="text-center w-full">
            <h2 className="text-xl font-bold text-white">Create Your Server</h2>
            <p className="text-xs text-discord-textMuted mt-1">
              Your server is where you and your friends hang out. Make yours and start talking.
            </p>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-discord-textMuted hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Server Icon Selector */}
          <div className="space-y-2 flex flex-col items-center">
            <label className="text-xs font-bold text-discord-textMuted uppercase tracking-wider">
              Server Icon
            </label>
            <div className="flex gap-2">
              {sampleIcons.map((icon, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setIconUrl(icon)}
                  className={`w-12 h-12 rounded-2xl overflow-hidden border-2 transition-all p-0.5 bg-discord-bgTertiary ${
                    iconUrl === icon ? 'border-yellow-400 scale-105' : 'border-transparent'
                  }`}
                >
                  <img src={icon} alt="icon" className="w-full h-full object-cover rounded-xl" />
                </button>
              ))}
            </div>
          </div>

          {/* Server Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-discord-textMuted uppercase tracking-wider">
              Server Name
            </label>
            <input
              type="text"
              required
              value={serverName}
              onChange={(e) => setServerName(e.target.value)}
              placeholder="e.g. Nerdy Gamers Guild"
              className="w-full bg-discord-bgTertiary text-white text-xs p-2.5 rounded-lg border border-[#1F2023] focus:outline-none focus:border-discord-blurple"
            />
          </div>

          {/* Server Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-discord-textMuted uppercase tracking-wider">
              Server Description
            </label>
            <input
              type="text"
              value={serverDescription}
              onChange={(e) => setServerDescription(e.target.value)}
              placeholder="What is this server about?"
              className="w-full bg-discord-bgTertiary text-white text-xs p-2.5 rounded-lg border border-[#1F2023] focus:outline-none focus:border-discord-blurple"
            />
          </div>

          {/* Nitro Level 3 Unlocked notice */}
          <div className="p-2.5 rounded-lg bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 flex-shrink-0 animate-pulse" />
            <span>Automatically unlocked with <strong>Level 3 Server Boost perks</strong> (HD 1080p 60fps streaming & custom vanity invite).</span>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 rounded text-xs font-semibold text-white hover:underline"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={!serverName.trim()}
              className="py-2 px-6 rounded bg-discord-blurple hover:bg-discord-blurpleHover text-white text-xs font-bold disabled:opacity-50 transition-colors shadow-md"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

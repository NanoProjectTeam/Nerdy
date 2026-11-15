'use client';

import React, { useState } from 'react';
import { X, Volume2, Sparkles } from 'lucide-react';
import { SOUNDBOARD_SOUNDS } from '@/data/cosmetics';
import { soundManager } from '@/lib/audio';

interface SoundboardModalProps {
  onClose: () => void;
  onPlaySound?: (soundName: string) => void;
}

export const SoundboardModal: React.FC<SoundboardModalProps> = ({ onClose, onPlaySound }) => {
  const [activeSoundId, setActiveSoundId] = useState<string | null>(null);

  const handlePlay = (soundKey: string, soundId: string, soundName: string) => {
    setActiveSoundId(soundId);
    soundManager.playSound(soundKey);
    if (onPlaySound) {
      onPlaySound(soundName);
    }
    setTimeout(() => setActiveSoundId(null), 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-discord-bgSecondary rounded-2xl overflow-hidden shadow-2xl border border-[#35373C] z-10 text-white p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#35373C] pb-3">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-yellow-400" />
            <h2 className="text-base font-bold text-white">Nerdy Soundboard (Free)</h2>
          </div>
          <button
            onClick={onClose}
            className="text-discord-textMuted hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-discord-textMuted">
          Click any sound to play it to your active voice channel or test it live with your speakers!
        </p>

        {/* Sound buttons grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto no-scrollbar">
          {SOUNDBOARD_SOUNDS.map((snd) => {
            const isPlaying = activeSoundId === snd.id;
            return (
              <button
                key={snd.id}
                onClick={() => handlePlay(snd.soundKey, snd.id, snd.name)}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center select-none active:scale-95 ${
                  isPlaying
                    ? 'bg-discord-blurple border-white scale-105 shadow-[0_0_15px_rgba(88,101,242,0.8)]'
                    : 'bg-discord-bgTertiary hover:bg-[#35373C] border-[#1F2023]'
                }`}
              >
                <span className={`text-2xl transition-transform ${isPlaying ? 'scale-125' : ''}`}>
                  {snd.emoji}
                </span>
                <span className="text-xs font-bold text-white truncate max-w-full">
                  {snd.name}
                </span>
                <span className="text-[9px] text-gray-400 font-medium">{snd.category}</span>
              </button>
            );
          })}
        </div>

        <div className="p-2.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs flex items-center gap-2">
          <Sparkles className="w-4 h-4 flex-shrink-0 animate-pulse" />
          <span>All sound slots and custom soundboard sounds are 100% unlocked with Nerdy.</span>
        </div>
      </div>
    </div>
  );
};

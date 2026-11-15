'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, MonitorUp, Sparkles, Check, Play, Pause } from 'lucide-react';
import { soundManager } from '@/lib/audio';

interface ScreenShareModalProps {
  onClose: () => void;
}

export const ScreenShareModal: React.FC<ScreenShareModalProps> = ({ onClose }) => {
  const [resolution, setResolution] = useState<'4K' | '1440p' | '1080p'>('4K');
  const [frameRate, setFrameRate] = useState<60 | 30>(60);
  const [isStreaming, setIsStreaming] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startScreenCapture = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setIsStreaming(true);
        soundManager.playSparkle();
      } else {
        setIsStreaming(true);
      }
    } catch {
      // Fallback to simulated stream
      setIsStreaming(true);
    }
  };

  const stopScreenCapture = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
  };

  useEffect(() => {
    return () => {
      stopScreenCapture();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-discord-bgSecondary rounded-2xl overflow-hidden shadow-2xl border border-[#35373C] z-10 text-white p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#35373C] pb-3">
          <div className="flex items-center gap-2">
            <MonitorUp className="w-5 h-5 text-discord-blurple" />
            <h2 className="text-base font-bold text-white">4K Nitro Screen Share (Unlocked)</h2>
          </div>
          <button
            onClick={onClose}
            className="text-discord-textMuted hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Screen Preview Box */}
        <div className="relative w-full h-52 bg-black rounded-xl overflow-hidden border border-[#232428] flex items-center justify-center shadow-inner">
          {isStreaming ? (
            <div className="w-full h-full relative flex items-center justify-center bg-zinc-950">
              <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline />
              <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-white" /> LIVE
              </div>
              <div className="absolute top-2 right-2 bg-pink-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {resolution} • {frameRate} FPS
              </div>
              <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-[11px] px-2 py-0.5 rounded text-gray-300">
                Wispbyte Ultra HD RTC Relay
              </div>
            </div>
          ) : (
            <div className="text-center space-y-2 p-4">
              <MonitorUp className="w-10 h-10 text-discord-blurple mx-auto animate-bounce" />
              <p className="text-xs text-gray-400">
                Choose a screen, application window, or game to stream in full 4K 60FPS.
              </p>
            </div>
          )}
        </div>

        {/* Stream Quality Selector (All Unlocked) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-discord-textMuted uppercase tracking-wider">
              Stream Quality
            </span>
            <span className="text-[11px] font-bold text-pink-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> All Paywalls Bypassed
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {(['4K', '1440p', '1080p'] as const).map((res) => (
              <button
                key={res}
                onClick={() => setResolution(res)}
                className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                  resolution === res
                    ? 'bg-discord-blurple border-white text-white shadow-md'
                    : 'bg-discord-bgTertiary border-[#1F2023] text-gray-300 hover:text-white'
                }`}
              >
                {res}
              </button>
            ))}
          </div>

          {/* Frame Rate */}
          <div className="grid grid-cols-2 gap-2">
            {([60, 30] as const).map((fps) => (
              <button
                key={fps}
                onClick={() => setFrameRate(fps)}
                className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                  frameRate === fps
                    ? 'bg-discord-blurple border-white text-white shadow-md'
                    : 'bg-discord-bgTertiary border-[#1F2023] text-gray-300 hover:text-white'
                }`}
              >
                {fps} FPS Smooth
              </button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-end gap-2 pt-2">
          {isStreaming ? (
            <button
              onClick={stopScreenCapture}
              className="py-2 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors"
            >
              Stop Sharing
            </button>
          ) : (
            <button
              onClick={startScreenCapture}
              className="py-2 px-5 rounded-lg bg-discord-blurple hover:bg-discord-blurpleHover text-white text-xs font-bold transition-colors shadow-lg flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" /> Start 4K Stream
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

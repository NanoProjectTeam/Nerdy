'use client';

import React from 'react';
import Image from 'next/image';
import { Plus, Compass, Sparkles } from 'lucide-react';
import { Server } from '@/types';

interface ServerRailProps {
  servers: Server[];
  activeServerId: string | null;
  onSelectServer: (id: string | null) => void;
  onOpenAddServer: () => void;
  onOpenNitroShop: () => void;
}

export const ServerRail: React.FC<ServerRailProps> = ({
  servers,
  activeServerId,
  onSelectServer,
  onOpenAddServer,
  onOpenNitroShop,
}) => {
  const isHomeActive = activeServerId === null;

  return (
    <nav className="w-[72px] h-full bg-discord-bgTertiary flex flex-col items-center py-3 select-none flex-shrink-0 z-20 overflow-y-auto no-scrollbar">
      {/* Home / Direct Messages (Nerdy Mascot) */}
      <div className="relative group flex items-center justify-center w-full mb-2">
        {/* Active Pill Indicator */}
        <div
          className={`absolute left-0 w-1 bg-white rounded-r-full transition-all duration-200 ${
            isHomeActive
              ? 'h-10 scale-100'
              : 'h-2 scale-0 group-hover:scale-100 group-hover:h-5'
          }`}
        />

        <button
          onClick={() => onSelectServer(null)}
          className={`relative w-12 h-12 flex items-center justify-center transition-all duration-200 overflow-hidden ${
            isHomeActive
              ? 'rounded-2xl bg-discord-blurple ring-2 ring-yellow-400'
              : 'rounded-[24px] hover:rounded-2xl bg-discord-bgSecondary hover:bg-discord-blurple'
          }`}
          title="Direct Messages • Nerdy Home"
        >
          <Image
            src="/mascot.png"
            alt="Nerdy Mascot"
            width={48}
            height={48}
            className="w-full h-full object-contain p-1 transition-transform group-hover:scale-110"
            unoptimized
          />
        </button>

        {/* Floating Tooltip */}
        <div className="absolute left-[80px] bg-[#111214] text-white text-sm font-semibold py-1.5 px-3 rounded-md shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 whitespace-nowrap z-50">
          Direct Messages
          <div className="absolute -left-1 top-1/2 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-[#111214]" />
        </div>
      </div>

      {/* Separator */}
      <div className="w-8 h-[2px] bg-[#35373C] rounded my-1" />

      {/* Free Nitro Locker Button */}
      <div className="relative group flex items-center justify-center w-full my-1.5">
        <button
          onClick={onOpenNitroShop}
          className="relative w-12 h-12 flex items-center justify-center rounded-[24px] hover:rounded-2xl bg-gradient-to-tr from-discord-nitroPurple via-discord-nitroPink to-yellow-300 hover:shadow-[0_0_20px_rgba(255,115,250,0.8)] transition-all duration-200 text-white"
          title="Free Nerdy Nitro & Cosmetics Shop"
        >
          <Sparkles className="w-6 h-6 animate-pulse text-white drop-shadow-md" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full border-2 border-discord-bgTertiary">
            FREE
          </span>
        </button>

        <div className="absolute left-[80px] bg-[#111214] text-white text-sm font-semibold py-1.5 px-3 rounded-md shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 whitespace-nowrap z-50">
          ✨ Free Nitro & Cosmetics Locker
          <div className="absolute -left-1 top-1/2 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-[#111214]" />
        </div>
      </div>

      {/* Separator */}
      <div className="w-8 h-[2px] bg-[#35373C] rounded my-1" />

      {/* Server List */}
      <div className="flex-1 w-full space-y-2 flex flex-col items-center">
        {servers.map((server) => {
          const isActive = activeServerId === server.id;
          return (
            <div key={server.id} className="relative group flex items-center justify-center w-full">
              {/* Active Pill Indicator */}
              <div
                className={`absolute left-0 w-1 bg-white rounded-r-full transition-all duration-200 ${
                  isActive
                    ? 'h-10 scale-100'
                    : 'h-2 scale-0 group-hover:scale-100 group-hover:h-5'
                }`}
              />

              <button
                onClick={() => onSelectServer(server.id)}
                className={`relative w-12 h-12 flex items-center justify-center transition-all duration-200 overflow-hidden font-bold text-sm ${
                  isActive
                    ? 'rounded-2xl bg-discord-blurple text-white shadow-lg'
                    : 'rounded-[24px] hover:rounded-2xl bg-discord-bgSecondary hover:bg-discord-blurple text-[#DBDEE1] hover:text-white'
                }`}
              >
                {server.icon ? (
                  <Image
                    src={server.icon}
                    alt={server.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                ) : (
                  <span>
                    {server.name
                      .split(' ')
                      .map((word) => word[0])
                      .slice(0, 3)
                      .join('')}
                  </span>
                )}

                {/* Boost Level 3 Badge */}
                {server.boostTier === 3 && (
                  <span className="absolute bottom-0 right-0 bg-pink-500 text-[9px] px-1 rounded-tl font-bold text-white">
                    L3
                  </span>
                )}
              </button>

              {/* Server Tooltip */}
              <div className="absolute left-[80px] bg-[#111214] text-white text-sm font-semibold py-1.5 px-3 rounded-md shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 whitespace-nowrap z-50">
                {server.name}
                <div className="absolute -left-1 top-1/2 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-[#111214]" />
              </div>
            </div>
          );
        })}

        {/* Add a Server Button */}
        <div className="relative group flex items-center justify-center w-full">
          <button
            onClick={onOpenAddServer}
            className="w-12 h-12 rounded-[24px] hover:rounded-2xl bg-discord-bgSecondary hover:bg-discord-green text-discord-green hover:text-white flex items-center justify-center transition-all duration-200 group-hover:shadow-md"
            title="Add a Server"
          >
            <Plus className="w-6 h-6" />
          </button>
          <div className="absolute left-[80px] bg-[#111214] text-white text-sm font-semibold py-1.5 px-3 rounded-md shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 whitespace-nowrap z-50">
            Add a Server
            <div className="absolute -left-1 top-1/2 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-[#111214]" />
          </div>
        </div>

        {/* Explore Discoverable Servers */}
        <div className="relative group flex items-center justify-center w-full">
          <button
            className="w-12 h-12 rounded-[24px] hover:rounded-2xl bg-discord-bgSecondary hover:bg-discord-green text-[#DBDEE1] hover:text-white flex items-center justify-center transition-all duration-200"
            title="Explore Discoverable Servers"
          >
            <Compass className="w-6 h-6" />
          </button>
          <div className="absolute left-[80px] bg-[#111214] text-white text-sm font-semibold py-1.5 px-3 rounded-md shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 whitespace-nowrap z-50">
            Explore Discoverable Servers
            <div className="absolute -left-1 top-1/2 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-[#111214]" />
          </div>
        </div>
      </div>
    </nav>
  );
};

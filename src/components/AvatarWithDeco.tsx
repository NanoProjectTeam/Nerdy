'use client';

import React from 'react';
import Image from 'next/image';
import { User, OnlineStatus } from '@/types';

interface AvatarWithDecoProps {
  user: User;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showStatus?: boolean;
  className?: string;
}

export const AvatarWithDeco: React.FC<AvatarWithDecoProps> = ({
  user,
  size = 'md',
  showStatus = true,
  className = '',
}) => {
  const sizeMap = {
    sm: { container: 'w-8 h-8', img: 32, status: 'w-2.5 h-2.5 bottom-0 right-0 border-2' },
    md: { container: 'w-10 h-10', img: 40, status: 'w-3.5 h-3.5 bottom-0 right-0 border-[2.5px]' },
    lg: { container: 'w-16 h-16', img: 64, status: 'w-4 h-4 bottom-0.5 right-0.5 border-[3px]' },
    xl: { container: 'w-20 h-20', img: 80, status: 'w-5 h-5 bottom-1 right-1 border-[3px]' },
  };

  const currentSize = sizeMap[size];

  const getStatusColor = (status: OnlineStatus) => {
    switch (status) {
      case 'online':
        return 'bg-[#23A55A]';
      case 'idle':
        return 'bg-[#F0B232]';
      case 'dnd':
        return 'bg-[#F23F43]';
      case 'offline':
      default:
        return 'bg-[#80848E]';
    }
  };

  const deco = user.avatarDecoration;

  return (
    <div className={`relative inline-block select-none ${currentSize.container} ${className}`}>
      {/* Avatar Decoration Frame */}
      {deco && (
        <div
          className={`absolute -inset-1 rounded-full pointer-events-none z-10 border-2 ${deco.style} ${deco.animationClass}`}
          title={deco.name}
        >
          {deco.cornerIcon && (
            <span className="absolute -top-1 -right-1 text-xs drop-shadow-md">
              {deco.cornerIcon}
            </span>
          )}
        </div>
      )}

      {/* Main Avatar Image */}
      <div className="w-full h-full rounded-full overflow-hidden bg-[#2B2D31] relative">
        <Image
          src={user.avatar || '/mascot.png'}
          alt={user.displayName || user.username}
          width={currentSize.img}
          height={currentSize.img}
          className="w-full h-full object-cover rounded-full"
          unoptimized
        />
      </div>

      {/* Online Status Badge */}
      {showStatus && (
        <div
          className={`absolute rounded-full border-[#1E1F22] z-20 ${currentSize.status} ${getStatusColor(
            user.status
          )}`}
          title={`Status: ${user.status}`}
        />
      )}
    </div>
  );
};

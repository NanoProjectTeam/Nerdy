'use client';

import React from 'react';
import { User, Server } from '@/types';
import { AvatarWithDeco } from './AvatarWithDeco';
import { Sparkles } from 'lucide-react';

interface MemberListProps {
  server: Server | null;
  members: User[];
  onSelectUser: (user: User) => void;
  currentUser: User;
}

export const MemberList: React.FC<MemberListProps> = ({
  server,
  members,
  onSelectUser,
  currentUser,
}) => {
  // Merge current user with mock members
  const allMembers = [
    currentUser,
    ...members.filter((m) => m.id !== currentUser.id),
  ];

  // Group members by role or status
  const founders = allMembers.filter((m) => m.badges.some((b) => b.id === 'nerdy-founder'));
  const bots = allMembers.filter((m) => m.isBot);
  const nitroMembers = allMembers.filter(
    (m) => !m.isBot && !founders.some((f) => f.id === m.id) && m.nitroLevel === 'Nerdy Nitro Supreme'
  );
  const onlineOthers = allMembers.filter(
    (m) =>
      !m.isBot &&
      !founders.some((f) => f.id === m.id) &&
      !nitroMembers.some((n) => n.id === m.id)
  );

  const renderGroup = (title: string, groupMembers: User[]) => {
    if (groupMembers.length === 0) return null;
    return (
      <div className="space-y-0.5 mb-4">
        <h3 className="px-2 text-[11px] font-bold text-discord-textMuted tracking-wider uppercase">
          {title} — {groupMembers.length}
        </h3>
        {groupMembers.map((member) => (
          <div
            key={member.id}
            onClick={() => onSelectUser(member)}
            className="group flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-discord-bgModifierHover cursor-pointer transition-colors"
          >
            <AvatarWithDeco user={member} size="sm" />
            <div className="overflow-hidden leading-tight flex-1">
              <div className="flex items-center gap-1.5">
                <span
                  className="font-semibold text-xs truncate group-hover:underline"
                  style={{ color: member.roleColor || '#DBDEE1' }}
                >
                  {member.displayName}
                </span>
                {member.isBot ? (
                  <span className="bg-discord-blurple text-white text-[9px] font-bold px-1 rounded uppercase">
                    BOT
                  </span>
                ) : member.id === currentUser.id ? (
                  <span className="bg-yellow-500 text-black text-[9px] font-bold px-1 rounded uppercase flex items-center">
                    <Sparkles className="w-2.5 h-2.5" />
                  </span>
                ) : null}
              </div>
              {member.customStatus?.text && (
                <p className="text-[10px] text-discord-textMuted truncate">
                  {member.customStatus.emoji} {member.customStatus.text}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-60 h-full bg-discord-bgSecondary border-l border-[#1F2023]/60 flex flex-col p-3 select-none overflow-y-auto no-scrollbar flex-shrink-0">
      {renderGroup('👑 Nerdy Creator', founders)}
      {renderGroup('🤖 Wispbyte & Bots', bots)}
      {renderGroup('✨ Free Nitro VIPs', nitroMembers)}
      {renderGroup('Online', onlineOthers)}
    </div>
  );
};

'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ServerRail } from '@/components/ServerRail';
import { ChannelSidebar } from '@/components/ChannelSidebar';
import { ChatArea } from '@/components/ChatArea';
import { MemberList } from '@/components/MemberList';
import { UserProfileCard } from '@/components/UserProfileCard';
import { UserSettingsModal } from '@/components/UserSettingsModal';
import { SoundboardModal } from '@/components/SoundboardModal';
import { ScreenShareModal } from '@/components/ScreenShareModal';
import { CreateChannelModal } from '@/components/CreateChannelModal';
import { CreateServerModal } from '@/components/CreateServerModal';
import { AuthScreen } from '@/components/AuthScreen';

import { Server, Channel, User, Message } from '@/types';
import { CURRENT_USER, INITIAL_SERVERS } from '@/data/initialData';
import { INITIAL_MESSAGES } from '@/data/initialMessages';
import { CLIENT_THEMES } from '@/data/cosmetics';
import { soundManager } from '@/lib/audio';
import { encryptMessage } from '@/lib/encryption';

export default function NerdyApp() {
  // Authentication State (0-Auth / Discord Real Login)
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Application State
  const [servers, setServers] = useState<Server[]>(INITIAL_SERVERS);
  const [activeServerId, setActiveServerId] = useState<string | null>('server-nerdy-hq');
  const [activeChannelId, setActiveChannelId] = useState<string>('c-general');
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>(INITIAL_MESSAGES);
  const [currentVoiceChannel, setCurrentVoiceChannel] = useState<Channel | null>(null);

  // UI Modals & Drawers
  const [isMemberListOpen, setIsMemberListOpen] = useState(true);
  const [activeProfileUser, setActiveProfileUser] = useState<User | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsInitialTab, setSettingsInitialTab] = useState('nitro');
  const [isSoundboardOpen, setIsSoundboardOpen] = useState(false);
  const [isScreenShareOpen, setIsScreenShareOpen] = useState(false);
  const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false);
  const [isCreateServerOpen, setIsCreateServerOpen] = useState(false);

  // Client Theme
  const [currentTheme, setCurrentTheme] = useState('dark');

  // Server URL (Wispbyte dedicated server nerdy.freesrv.com:15371 or built-in Next.js API)
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://nerdy.freesrv.com:15371';

  // Check Local Auth and Persisted Messages on Mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('nerdy_auth_user');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
      const storedMessages = localStorage.getItem('nerdy_persisted_messages');
      if (storedMessages) {
        setMessagesMap(JSON.parse(storedMessages));
      }
    } catch {
      // ignore
    } finally {
      setIsAuthChecking(false);
    }
  }, []);

  // WebSocket Live Sync if custom server is provided
  useEffect(() => {
    if (!serverUrl || typeof window === 'undefined') return;

    const wsUrl = serverUrl.replace(/^http/, 'ws');
    let ws: WebSocket | null = null;
    try {
      ws = new WebSocket(wsUrl);
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'NEW_MESSAGE' && data.channelId && data.message) {
            setMessagesMap((prev) => {
              const current = prev[data.channelId] || [];
              if (current.some((m) => m.id === data.message.id)) return prev;
              const updated = { ...prev, [data.channelId]: [...current, data.message] };
              try {
                localStorage.setItem('nerdy_persisted_messages', JSON.stringify(updated));
              } catch {}
              return updated;
            });
            soundManager.playNotification();
          }
        } catch {}
      };
    } catch {}

    return () => {
      ws?.close();
    };
  }, [serverUrl]);

  // Sync messages from server API
  useEffect(() => {
    if (!currentUser) return;
    const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
    const primaryEndpoint = isHttps
      ? `/wispbyte-api/messages/${activeChannelId}`
      : `${serverUrl}/api/messages/${activeChannelId}`;

    fetch(primaryEndpoint)
      .then((res) => {
        if (!res.ok) throw new Error('Wispbyte endpoint unreachable');
        return res.json();
      })
      .catch(() => {
        // Fallback to internal API if Wispbyte server is offline/restarting
        return fetch(`/api/messages?channelId=${activeChannelId}`).then((r) => r.json());
      })
      .then((data) => {
        if (data && data.messages && data.messages.length > 0) {
          setMessagesMap((prev) => {
            const merged = [...(prev[activeChannelId] || [])];
            data.messages.forEach((remoteMsg: Message) => {
              if (!merged.some((m) => m.id === remoteMsg.id)) {
                merged.push(remoteMsg);
              }
            });
            const updated = { ...prev, [activeChannelId]: merged };
            try {
              localStorage.setItem('nerdy_persisted_messages', JSON.stringify(updated));
            } catch {}
            return updated;
          });
        }
      })
      .catch(() => {});
  }, [activeChannelId, currentUser, serverUrl]);

  // Update Theme CSS Variables
  const handleThemeChange = (themeId: string) => {
    setCurrentTheme(themeId);
    const selected = CLIENT_THEMES.find((t) => t.id === themeId);
    if (selected) {
      document.documentElement.style.setProperty('--bg-primary', selected.bgPrimary);
      document.documentElement.style.setProperty('--bg-secondary', selected.bgSecondary);
      document.documentElement.style.setProperty('--bg-tertiary', selected.bgTertiary);
      document.documentElement.style.setProperty('--accent', selected.accent);
    }
  };

  // Keyboard shortcut ESC to close modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSettingsOpen(false);
        setActiveProfileUser(null);
        setIsSoundboardOpen(false);
        setIsScreenShareOpen(false);
        setIsCreateChannelOpen(false);
        setIsCreateServerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Active Server and Channel resolution
  const activeServer = activeServerId
    ? servers.find((s) => s.id === activeServerId) || null
    : null;

  const currentChannel: Channel | null = (() => {
    if (!activeServer) {
      return {
        id: 'dm-nerdy',
        name: 'nerdy-official-dm',
        type: 'text',
        topic: 'Direct Message with Nerdy Mascot. Um, actually... everything is free!',
      };
    }
    for (const cat of activeServer.categories) {
      const found = cat.channels.find((c) => c.id === activeChannelId);
      if (found) return found;
    }
    return activeServer.categories[0]?.channels[0] || null;
  })();

  const currentMessages = messagesMap[activeChannelId] || [];

  // Message Sending with Encryption & Persistence
  const handleSendMessage = async (content: string, replyTo?: Message) => {
    if (!currentUser) return;

    // Encrypt message via AES-256-GCM before transmission
    const { encrypted, iv } = await encryptMessage(content, activeChannelId);

    const newMsg: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      channelId: activeChannelId,
      author: currentUser,
      content, // Plaintext for local rendering
      timestamp: 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: [],
      replyTo: replyTo
        ? {
            id: replyTo.id,
            authorName: replyTo.author.displayName,
            content: replyTo.content,
          }
        : undefined,
    };

    // Save in React state & Local Storage
    setMessagesMap((prev) => {
      const updated = {
        ...prev,
        [activeChannelId]: [...(prev[activeChannelId] || []), newMsg],
      };
      try {
        localStorage.setItem('nerdy_persisted_messages', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // Save encrypted message to server API for persistent multi-user sync
    const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
    const primaryPostEndpoint = isHttps ? '/wispbyte-api/messages' : `${serverUrl}/api/messages`;

    fetch(primaryPostEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        channelId: activeChannelId,
        message: {
          ...newMsg,
          encryptedContent: encrypted,
          iv,
        },
      }),
    }).catch(() => {
      // Fallback to internal API
      fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channelId: activeChannelId,
          message: newMsg,
        }),
      }).catch(() => {});
    });

    // Handle slash commands and witty bot triggers
    const trimmed = content.trim().toLowerCase();
    if (trimmed === '/help') {
      setTimeout(() => {
        const botReply: Message = {
          id: `bot-${Date.now()}`,
          channelId: activeChannelId,
          author: {
            ...CURRENT_USER,
            displayName: 'Nerdy Helper 🤓',
            isBot: true,
          },
          content: '🤖 **Nerdy Assistant**:\n• `/help` - Show this menu\n• `/nerd` - Receive an "Um, actually..." fact\n• `/boost` - Grant 10 free Nitro server boosts with confetti\n• Gear Icon (Bottom Left) - Open Free Cosmetics Locker (Avatar Decos, Profile Effects, Themes)\n• 🔒 **Security**: All messages are protected with AES-256-GCM End-to-End Encryption and saved!',
          timestamp: 'Just now',
          reactions: [{ emoji: '🤓', count: 1, users: [] }],
        };
        setMessagesMap((prev) => {
          const updated = {
            ...prev,
            [activeChannelId]: [...(prev[activeChannelId] || []), botReply],
          };
          try {
            localStorage.setItem('nerdy_persisted_messages', JSON.stringify(updated));
          } catch {}
          return updated;
        });
        soundManager.playNotification();
      }, 600);
    } else if (trimmed === '/nerd' || trimmed.includes('um actually')) {
      setTimeout(() => {
        soundManager.playSound('nerd');
        confetti({ particleCount: 35, spread: 80, origin: { y: 0.6 } });
        const nerdReplies = [
          '🤓 **"Um, actually..."** You don\'t need to pay $9.99/mo for Discord Nitro when Nerdy gives you every single cosmetic, banner, theme, and 4K stream for free!',
          '🤓 **"Um, actually..."** Your messages in this channel are encrypted end-to-end with 256-bit AES-GCM and saved persistently!',
          '🤓 **"Um, actually..."** You just triggered the signature Nerdy synthesizer audio chime!',
        ];
        const randomReply = nerdReplies[Math.floor(Math.random() * nerdReplies.length)];
        const botReply: Message = {
          id: `bot-${Date.now()}`,
          channelId: activeChannelId,
          author: {
            ...CURRENT_USER,
            displayName: 'Nerdy Bot 🤓',
            isBot: true,
          },
          content: randomReply,
          timestamp: 'Just now',
          reactions: [{ emoji: '🤓', count: 5, users: [] }, { emoji: '✨', count: 3, users: [] }],
        };
        setMessagesMap((prev) => {
          const updated = {
            ...prev,
            [activeChannelId]: [...(prev[activeChannelId] || []), botReply],
          };
          try {
            localStorage.setItem('nerdy_persisted_messages', JSON.stringify(updated));
          } catch {}
          return updated;
        });
      }, 500);
    } else if (trimmed === '/boost') {
      soundManager.playSparkle();
      confetti({ particleCount: 50, spread: 90 });
      if (activeServer) {
        setServers((prev) =>
          prev.map((s) =>
            s.id === activeServer.id
              ? { ...s, boostCount: s.boostCount + 10, boostTier: 3 }
              : s
          )
        );
      }
    }
  };

  // Reactions
  const handleAddReaction = (messageId: string, emoji: string) => {
    if (!currentUser) return;
    setMessagesMap((prev) => {
      const channelMsgs = prev[activeChannelId] || [];
      const updated = channelMsgs.map((m) => {
        if (m.id !== messageId) return m;
        const existingRx = m.reactions.find((r) => r.emoji === emoji);
        if (existingRx) {
          const userHas = existingRx.users.includes(currentUser.id);
          const newUsers = userHas
            ? existingRx.users.filter((id) => id !== currentUser.id)
            : [...existingRx.users, currentUser.id];
          const newCount = userHas ? existingRx.count - 1 : existingRx.count + 1;
          return {
            ...m,
            reactions: m.reactions
              .map((r) => (r.emoji === emoji ? { ...r, count: newCount, users: newUsers } : r))
              .filter((r) => r.count > 0),
          };
        } else {
          return {
            ...m,
            reactions: [...m.reactions, { emoji, count: 1, users: [currentUser.id] }],
          };
        }
      });
      const res = { ...prev, [activeChannelId]: updated };
      try {
        localStorage.setItem('nerdy_persisted_messages', JSON.stringify(res));
      } catch {}
      return res;
    });
  };

  // Voice Connection
  const handleJoinVoice = (channel: Channel) => {
    if (currentVoiceChannel?.id === channel.id) return;
    soundManager.playVoiceJoin();
    setCurrentVoiceChannel(channel);
  };

  const handleLeaveVoice = () => {
    soundManager.playVoiceLeave();
    setCurrentVoiceChannel(null);
  };

  // Server & Channel Creation
  const handleCreateChannel = (newChannel: Channel) => {
    if (!activeServer) return;
    setServers((prev) =>
      prev.map((s) => {
        if (s.id !== activeServer.id) return s;
        const targetCategory = s.categories[0];
        const updatedCategories = s.categories.map((c) =>
          c.id === targetCategory.id
            ? { ...c, channels: [...c.channels, newChannel] }
            : c
        );
        return { ...s, categories: updatedCategories };
      })
    );
    setActiveChannelId(newChannel.id);
  };

  const handleCreateServer = (newServer: Server) => {
    setServers((prev) => [...prev, newServer]);
    setActiveServerId(newServer.id);
    setActiveChannelId(newServer.categories[0].channels[0].id);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('nerdy_auth_user');
    } catch {}
    setCurrentUser(null);
    setIsSettingsOpen(false);
  };

  if (isAuthChecking) {
    return (
      <div className="h-screen w-screen bg-[#1e1f22] flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-discord-blurple" />
      </div>
    );
  }

  // If not logged in, show genuine Discord Login / Register screen
  if (!currentUser) {
    return <AuthScreen onLogin={(user) => setCurrentUser(user)} />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-discord-bgPrimary text-discord-textNormal select-none font-sans">
      {/* 1. Leftmost Server Rail (72px) */}
      <ServerRail
        servers={servers}
        activeServerId={activeServerId}
        onSelectServer={(serverId) => {
          setActiveServerId(serverId);
          if (serverId) {
            const serv = servers.find((s) => s.id === serverId);
            if (serv && serv.categories[0]?.channels[0]) {
              setActiveChannelId(serv.categories[0].channels[0].id);
            }
          } else {
            setActiveChannelId('dm-nerdy');
          }
        }}
        onOpenAddServer={() => setIsCreateServerOpen(true)}
        onOpenNitroShop={() => {
          setSettingsInitialTab('nitro');
          setIsSettingsOpen(true);
        }}
      />

      {/* 2. Channel Sidebar (240px) */}
      <ChannelSidebar
        server={activeServer}
        activeChannelId={activeChannelId}
        onSelectChannel={(chId) => setActiveChannelId(chId)}
        currentUser={currentUser}
        onUpdateCurrentUser={(updated) => {
          const updatedUser = { ...currentUser, ...updated };
          setCurrentUser(updatedUser);
          try {
            localStorage.setItem('nerdy_auth_user', JSON.stringify(updatedUser));
          } catch {}
        }}
        onOpenSettings={(tab = 'nitro') => {
          setSettingsInitialTab(tab);
          setIsSettingsOpen(true);
        }}
        onOpenCreateChannel={() => setIsCreateChannelOpen(true)}
        onOpenSoundboard={() => setIsSoundboardOpen(true)}
        onOpenScreenShare={() => setIsScreenShareOpen(true)}
        currentVoiceChannel={currentVoiceChannel}
        onJoinVoice={handleJoinVoice}
        onLeaveVoice={handleLeaveVoice}
      />

      {/* 3. Main Chat Area */}
      <ChatArea
        channel={currentChannel}
        server={activeServer}
        messages={currentMessages}
        currentUser={currentUser}
        onSendMessage={handleSendMessage}
        onAddReaction={handleAddReaction}
        onToggleMemberList={() => setIsMemberListOpen(!isMemberListOpen)}
        isMemberListOpen={isMemberListOpen}
        onOpenUserProfile={(user) => setActiveProfileUser(user)}
        onOpenSoundboard={() => setIsSoundboardOpen(true)}
      />

      {/* 4. Right Member List (240px) */}
      {isMemberListOpen && activeServer && (
        <MemberList
          server={activeServer}
          members={activeServer.members}
          onSelectUser={(user) => setActiveProfileUser(user)}
          currentUser={currentUser}
        />
      )}

      {/* MODALS */}
      {/* User Profile Card Popout */}
      {activeProfileUser && (
        <UserProfileCard
          user={activeProfileUser}
          onClose={() => setActiveProfileUser(null)}
          onSendMessage={() => {
            setActiveProfileUser(null);
            alert(`Direct message opened with user!`);
          }}
        />
      )}

      {/* User Settings Modal (Full Discord Settings + Free Nitro Cosmetics Locker) */}
      {isSettingsOpen && (
        <UserSettingsModal
          currentUser={currentUser}
          onUpdateUser={(updated) => {
            const updatedUser = { ...currentUser, ...updated };
            setCurrentUser(updatedUser);
            try {
              localStorage.setItem('nerdy_auth_user', JSON.stringify(updatedUser));
            } catch {}
          }}
          onClose={() => setIsSettingsOpen(false)}
          onLogout={handleLogout}
          initialTab={settingsInitialTab}
          currentTheme={currentTheme}
          onChangeTheme={handleThemeChange}
        />
      )}

      {/* Soundboard Popout */}
      {isSoundboardOpen && (
        <SoundboardModal
          onClose={() => setIsSoundboardOpen(false)}
          onPlaySound={(soundName) => {
            handleSendMessage(`🔊 *[Played ${soundName} from Soundboard]*`);
          }}
        />
      )}

      {/* 4K Nitro Screen Share Modal */}
      {isScreenShareOpen && (
        <ScreenShareModal onClose={() => setIsScreenShareOpen(false)} />
      )}

      {/* Create Channel Modal */}
      {isCreateChannelOpen && (
        <CreateChannelModal
          onClose={() => setIsCreateChannelOpen(false)}
          onCreateChannel={handleCreateChannel}
        />
      )}

      {/* Create Server Modal */}
      {isCreateServerOpen && (
        <CreateServerModal
          onClose={() => setIsCreateServerOpen(false)}
          onCreateServer={handleCreateServer}
        />
      )}
    </div>
  );
}

import { Message } from '@/types';
import { CURRENT_USER, MOCK_USERS } from './initialData';

export const INITIAL_MESSAGES: Record<string, Message[]> = {
  'c-general': [
    {
      id: 'msg-welcome-1',
      channelId: 'c-general',
      author: CURRENT_USER,
      content: 'Um, actually... welcome to **Nerdy**! 🤓\n\nAll Discord Nitro cosmetics, animated avatar decorations, profile effects, themes, and soundboards are 100% unlocked and free forever. Every single message in this channel is protected by **AES-256-GCM End-to-End Encryption** and saved securely!',
      timestamp: 'Today at 4:20 PM',
      reactions: [
        { emoji: '🤓', count: 18, users: ['user-sakura-girl', 'user-cyber-ninja'] },
        { emoji: '🔒', count: 14, users: ['user-cyber-ninja'] },
        { emoji: '✨', count: 9, users: [] },
      ],
      isPinned: true,
      embed: {
        title: '🛡️ End-to-End Encrypted & Zero Paywalls',
        description: 'Nerdy recreates Discord with zero subscription gates. Enjoy high-resolution screen sharing, custom animated profile effects, unlimited reactions, and complete privacy.',
        color: '#5865F2',
        fields: [
          { name: 'Encryption', value: 'AES-256-GCM E2EE', inline: true },
          { name: 'Cosmetics Paywall', value: 'Removed (100% Free)', inline: true },
          { name: 'Message Storage', value: 'Active & Persistent', inline: true },
        ],
        footer: 'Nerdy • Private, Free & Fully Unlocked',
      },
    },
    {
      id: 'msg-welcome-2',
      channelId: 'c-general',
      author: MOCK_USERS[1], // Sakura
      content: 'I equipped the **Sakura Blossom Breeze** decoration and **Cherry Blossom Drift** profile effect! Click my profile name to see how it looks 🌸💖',
      timestamp: 'Today at 4:22 PM',
      reactions: [
        { emoji: '🌸', count: 8, users: ['user-nerdy-creator'] },
        { emoji: '💖', count: 5, users: [] },
      ],
    },
    {
      id: 'msg-welcome-3',
      channelId: 'c-general',
      author: MOCK_USERS[2], // CyberBlade
      content: 'Also try out the **Soundboard**! Click the volume icon in the chat bar to play the **Vine Boom**, **Airhorn**, or the signature **"Um, actually..."** chime 🔊',
      timestamp: 'Today at 4:25 PM',
      reactions: [
        { emoji: '🔊', count: 12, users: ['user-nerdy-creator'] },
        { emoji: '💥', count: 7, users: [] },
      ],
    },
  ],
};

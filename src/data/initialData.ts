import { User, Server } from '@/types';
import { AVATAR_DECORATIONS, PROFILE_EFFECTS, UNLOCKED_BADGES } from './cosmetics';

export const CURRENT_USER: User = {
  id: 'user-nerdy-creator',
  username: 'nerd_master',
  discriminator: '0001',
  displayName: 'Nerdy Master 🤓',
  avatar: '/mascot.png',
  banner: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
  bio: 'Um, actually... all Discord features and cosmetics are completely FREE here on Nerdy! Zero paywalls, real end-to-end encryption.',
  pronouns: 'he/they',
  status: 'online',
  customStatus: {
    emoji: '🤓',
    text: 'Um, actually... everything is free!',
  },
  avatarDecoration: AVATAR_DECORATIONS[0],
  profileEffect: PROFILE_EFFECTS[0],
  badges: UNLOCKED_BADGES,
  roleColor: '#FEE75C',
  nitroLevel: 'Nerdy Nitro Supreme',
  primaryColor: '#5865F2',
  accentColor: '#FF73FA',
};

export const MOCK_USERS: User[] = [
  CURRENT_USER,
  {
    id: 'user-sakura-girl',
    username: 'sakura_dreamer',
    discriminator: '2026',
    displayName: 'Sakura🌸',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    banner: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    bio: 'Loving the free Sakura avatar decoration & falling petal effects! No more paying $9.99 for Nitro ✨',
    pronouns: 'she/her',
    status: 'idle',
    badges: [UNLOCKED_BADGES[1], UNLOCKED_BADGES[2]],
    roleColor: '#f472b6',
    nitroLevel: 'Nerdy Nitro Supreme',
    avatarDecoration: AVATAR_DECORATIONS[2],
    profileEffect: PROFILE_EFFECTS[3],
  },
  {
    id: 'user-cyber-ninja',
    username: 'synth_blade',
    discriminator: '1337',
    displayName: '⚡ CyberBlade',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    banner: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    bio: 'Fullstack Hacker & Gamer. Enjoying fully encrypted chats and free Discord cosmetics.',
    pronouns: 'he/him',
    status: 'online',
    customStatus: { emoji: '🎮', text: 'Testing E2EE chat' },
    badges: [UNLOCKED_BADGES[2], UNLOCKED_BADGES[4], UNLOCKED_BADGES[5]],
    roleColor: '#22d3ee',
    nitroLevel: 'Nerdy Nitro Supreme',
    avatarDecoration: AVATAR_DECORATIONS[1],
    profileEffect: PROFILE_EFFECTS[2],
  },
];

export const INITIAL_SERVERS: Server[] = [
  {
    id: 'server-nerdy-hq',
    name: 'Nerdy Official HQ',
    icon: '/mascot.png',
    banner: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    description: 'The official home of Nerdy! Free cosmetics, zero paywalls, end-to-end encrypted messaging.',
    boostTier: 3,
    boostCount: 42,
    roles: [
      { id: 'role-founder', name: '👑 Nerdy Founder', color: '#FEE75C', hoist: true },
      { id: 'role-nitro', name: '✨ Nerdy Nitro Supreme', color: '#FF73FA', hoist: true },
      { id: 'role-member', name: 'Nerds', color: '#949BA4', hoist: false },
    ],
    categories: [
      {
        id: 'cat-text',
        name: 'TEXT CHANNELS',
        channels: [
          { id: 'c-general', name: 'general', type: 'text', topic: 'Main lobby for chatting with real-time end-to-end encryption.' },
        ],
      },
      {
        id: 'cat-voice',
        name: 'VOICE CHANNELS',
        channels: [
          { id: 'c-v-general', name: '🔊 General Voice', type: 'voice', topic: 'Voice chat with 4K screen share and soundboard' },
        ],
      },
    ],
    members: MOCK_USERS,
  },
];

export type OnlineStatus = 'online' | 'idle' | 'dnd' | 'offline';

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  color?: string;
}

export interface AvatarDecoration {
  id: string;
  name: string;
  category: string;
  style: string; // Tailwind/CSS effect
  borderGlow: string;
  cornerIcon?: string;
  animationClass: string;
}

export interface ProfileEffect {
  id: string;
  name: string;
  description: string;
  type: 'matrix' | 'cosmic' | 'synthwave' | 'sakura' | 'glitch' | 'fire' | 'lightning' | 'bubbles' | 'cyberpunk';
  gradient: string;
  ambientColor: string;
}

export interface User {
  id: string;
  username: string;
  discriminator: string;
  displayName: string;
  avatar: string;
  banner: string;
  bio: string;
  pronouns: string;
  status: OnlineStatus;
  customStatus?: {
    text: string;
    emoji?: string;
  };
  avatarDecoration?: AvatarDecoration;
  profileEffect?: ProfileEffect;
  badges: Badge[];
  roleColor?: string;
  isBot?: boolean;
  nitroLevel: 'Basic' | 'Nitro' | 'Nerdy Nitro Supreme';
  customSoundKey?: string;
  primaryColor?: string;
  accentColor?: string;
}

export interface Role {
  id: string;
  name: string;
  color: string;
  hoist: boolean; // displayed separately in member list
}

export interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice' | 'announcement';
  topic?: string;
  unread?: boolean;
  mentionCount?: number;
  categoryId?: string;
}

export interface Category {
  id: string;
  name: string;
  channels: Channel[];
}

export interface Reaction {
  emoji: string;
  count: number;
  users: string[]; // user ids
}

export interface EmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

export interface MessageEmbed {
  title?: string;
  description?: string;
  url?: string;
  color?: string;
  image?: string;
  thumbnail?: string;
  fields?: EmbedField[];
  footer?: string;
}

export interface MessageAttachment {
  id: string;
  url: string;
  name: string;
  size: string;
  type: 'image' | 'video' | 'audio' | 'file';
}

export interface Message {
  id: string;
  channelId: string;
  author: User;
  content: string;
  timestamp: string;
  reactions: Reaction[];
  attachments?: MessageAttachment[];
  replyTo?: {
    id: string;
    authorName: string;
    content: string;
  };
  isPinned?: boolean;
  embed?: MessageEmbed;
}

export interface Server {
  id: string;
  name: string;
  icon?: string;
  banner?: string;
  description: string;
  boostTier: number; // 0, 1, 2, 3
  boostCount: number;
  categories: Category[];
  roles: Role[];
  members: User[];
  isWispbyteNode?: boolean;
}

export interface SoundboardSound {
  id: string;
  name: string;
  emoji: string;
  soundKey: string;
  volume: number;
  category: 'Popular' | 'Meme' | 'Sound FX' | 'Nerdy Exclusives';
}

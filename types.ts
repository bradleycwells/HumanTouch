export enum UserRole {
  BUYER = 'BUYER',
  ARTIST = 'ARTIST',
  NONE = 'NONE'
}

export interface User {
  id: string;
  email: string;
  roles: (UserRole.BUYER | UserRole.ARTIST)[];
}

export enum JobStatus {
  PENDING = 'Pending',
  ACCEPTED = 'Accepted',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed'
}

export interface Artwork {
  id: string;
  prompt: string;
  imageUrl: string; // base64 string
  ownerId: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
}

export interface Job {
  id: string;
  artwork: Artwork;
  title: string;
  description: string;
  budget: number;
  status: JobStatus;
  buyerId: string;
  artistId: string | null;
  messages: Message[];
}
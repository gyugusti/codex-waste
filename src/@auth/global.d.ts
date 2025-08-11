/* eslint-disable prettier/prettier */
import type { DefaultSession } from 'next-auth';
import type { User as DbUser } from '@auth/user';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    user: {
      id: number;
      username: string;
      nama_lengkap: string;
      role: string;
    } & DefaultSession['user'];
    db?: DbUser;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    user?: {
      id: number;
      username: string;
      nama_lengkap: string;
      role: string;
    };
  }
}

// memastikan ini dianggap module augmentation
export {};

import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    user?: {
      id: number;
      username: string;
      nama_lengkap: string;
      role: string;
    };
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

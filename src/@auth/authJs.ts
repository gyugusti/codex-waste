import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import type { NextAuthConfig } from 'next-auth';

interface ApiUser {
  id: number;
  username: string;
  nama_lengkap: string;
  role: string;
  token: string;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error('NEXT_PUBLIC_API_URL is not defined');
}

const credentialsProvider = Credentials({
  name: 'Credentials',
  credentials: {
    username: { label: 'Username', type: 'text' },
    password: { label: 'Password', type: 'password' },
  },
  async authorize(credentials) {
    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: credentials?.username,
          password: credentials?.password,
          akses_modul: 3,
        }),
      });

      if (!response.ok) {
        return null;
      }

      const data = (await response.json()) as {
        token?: string;
        user?: Omit<ApiUser, 'token'>;
      };

      if (!data.token || !data.user) {
        return null;
      }

      return { ...data.user, token: data.token } as ApiUser;
    } catch {
      return null;
    }
  },
});

const config: NextAuthConfig = {
  providers: [credentialsProvider],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const apiUser = user as ApiUser;
        token.accessToken = apiUser.token;
        token.user = {
          id: apiUser.id,
          username: apiUser.username,
          nama_lengkap: apiUser.nama_lengkap,
          role: apiUser.role,
        };
      }

      return token;
    },
    async session({ session, token }) {
      if (token.accessToken) {
        session.accessToken = token.accessToken as string;
      }

      if (token.user) {
        session.user = token.user as ApiUser;
      }

      return session;
    },
  },
  trustHost: true,
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);

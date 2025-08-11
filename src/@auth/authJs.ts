import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import type { NextAuthConfig } from 'next-auth';

/**
 * NextAuth configuration using a basic Credentials provider.
 * This exports the `auth` helper used in the app layout and
 * `handlers` for the auth API routes.
 */
const authConfig: NextAuthConfig = {
	providers: [
                Credentials({
                        name: 'Credentials',
                        credentials: {
                                username: { label: 'Username', type: 'text' },
                                password: { label: 'Password', type: 'password' }
                        },
                        async authorize(credentials) {
                                if (!credentials?.username) {
                                        return null;
                                }

                                try {
                                        const response = await fetch('http://127.0.0.1:8000/api/login', {
                                                method: 'POST',
                                                headers: {
                                                        'Content-Type': 'application/json'
                                                },
                                                body: JSON.stringify({
                                                        username: credentials.username,
                                                        password: credentials.password,
                                                        akses_modul: 0
                                                })
                                        });

                                        if (!response.ok) {
                                                return null;
                                        }

                                        const data = await response.json();
                                        const user = data.user ?? data;

                                        return {
                                                id: user.id,
                                                username: user.username,
                                                nama_lengkap: user.nama_lengkap ?? user.username,
                                                role: user.role ?? 'user'
                                        } as {
                                                id: number;
                                                username: string;
                                                nama_lengkap: string;
                                                role: string;
                                        };
                                } catch (error) {
                                        return null;
                                }
                        }
                })
        ],
	session: {
		strategy: 'jwt'
	}
};

export const { handlers, auth } = NextAuth(authConfig);

// Export provider map for UI components
export const authJsProviderMap = authConfig.providers;

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

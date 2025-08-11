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
				email: { label: 'Email', type: 'text' },
				password: { label: 'Password', type: 'password' }
			},
			async authorize(credentials) {
				if (!credentials?.email) {
					return null;
				}

				return {
					id: 1,
					username: credentials.email,
					nama_lengkap: credentials.email,
					role: 'user'
				} as {
					id: number;
					username: string;
					nama_lengkap: string;
					role: string;
				};
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

/* eslint-disable prettier/prettier */
import { DefaultSession } from 'next-auth';
import { User as DbUser } from '@auth/user';

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

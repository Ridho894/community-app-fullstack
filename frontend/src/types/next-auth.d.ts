import "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            username?: string | null;
            email?: string | null;
            role?: string | null;
        };
        accessToken: string;
    }

    interface User {
        id: string;
        username?: string | null;
        email?: string | null;
        role?: string | null;
        accessToken: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        username?: string | null;
        role?: string | null;
        accessToken: string;
    }
} 
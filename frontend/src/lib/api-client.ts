import { getSession } from "next-auth/react";

class ApiError extends Error {
    status: number;
    data: any;

    constructor(status: number, message: string, data: any = null) {
        super(message);
        this.status = status;
        this.data = data;
        this.name = "ApiError";
    }
}

export async function apiClient<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const url = `${apiUrl}${endpoint}`;

    // Get the session to include auth token if available
    const session = await getSession();

    const headers = new Headers(options.headers);
    headers.append("Content-Type", "application/json");

    // Add authorization header if session exists
    if (session?.accessToken) {
        headers.append("Authorization", `Bearer ${session.accessToken}`);
    }

    const config: RequestInit = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            throw new ApiError(
                response.status,
                data.message || "An error occurred",
                data
            );
        }

        return data as T;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Network error or server unavailable");
    }
}

// Auth-specific API functions
export const authApi = {
    async login(email: string, password: string) {
        return apiClient("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });
    },

    async register(name: string, email: string, password: string) {
        return apiClient("/api/auth/register", {
            method: "POST",
            body: JSON.stringify({ name, email, password }),
        });
    },

    async getProfile() {
        return apiClient("/api/users/profile");
    },
}; 
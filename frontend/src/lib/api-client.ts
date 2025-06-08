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

    // Create a new headers object from the provided headers or a new Headers instance
    const headers = new Headers(options.headers);

    // Check if the request body is FormData
    const isFormData = options.body instanceof FormData;

    // Only set Content-Type for non-FormData requests if it's not already set
    if (!isFormData && !headers.has('Content-Type')) {
        headers.append("Content-Type", "application/json");
    }

    // Add authorization header if session exists
    if (session?.accessToken) {
        headers.append("Authorization", `Bearer ${session.accessToken}`);
    }

    // Create the final config object
    const config: RequestInit = {
        ...options,
        headers,
    };

    try {
        // For FormData requests, remove the Content-Type header entirely
        // to let the browser set it with the proper boundary
        if (isFormData && config.headers instanceof Headers) {
            config.headers.delete('Content-Type');
        }

        const response = await fetch(url, config);

        // Try to parse as JSON, but handle cases where response might not be JSON
        let data;
        try {
            data = await response.json();
        } catch (e) {
            // If not JSON, get text content
            const textContent = await response.text();
            data = { message: textContent };
        }

        if (!response.ok) {
            console.error("API Error:", data);
            throw new ApiError(
                response.status,
                data.message || "An error occurred",
                data
            );
        }

        return data as T;
    } catch (error) {
        console.error("API Request failed:", error);
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
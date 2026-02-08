import { fetch } from "undici";
import { getProxyAgent, type IProxyConfig } from "../core/proxy.js";
import { generateSuggestions } from "../utils/generate.js";
import type { IResponse } from "../core/client.js";

const status_codes: Record<number, { code: number; message: string }> = {
    0: { code: 0, message: 'Username is valid' },
    1: { code: 1, message: 'Username is already in use' },
    2: { code: 2, message: 'Username not appropriate for Roblox' },
    3: { code: 3, message: 'Usernames can be 3 to 20 characters long' }
};

const validateRobloxUsername = async (
    username: string,
    proxy?: IProxyConfig
): Promise<number> => {
    const agent = getProxyAgent(proxy);
    const token = await getCsrfToken(proxy);

    const response = await fetch(
        "https://auth.roblox.com/v1/usernames/validate",
        {
            method: "POST",
            dispatcher: agent,
            headers: {
                "Content-Type": "application/json",
                "Origin": "https://www.roblox.com",
                "x-csrf-token": token
            },
            body: JSON.stringify({
                username,
                birthday: "2000-10-10"
            })
        }
    );

    const data = await response.json() as { code: number; message: string };
    return data.code;
};

const getCsrfToken = async (proxy?: IProxyConfig): Promise<string> => {
    const agent = getProxyAgent(proxy);

    const html = await fetch("https://www.roblox.com/", {
        method: "GET",
        dispatcher: agent,
        headers: { "Content-Type": "text/html" }
    });

    const text = await html.text();
    const match = text.match(/<meta name="csrf-token" data-token="([^"]+)"/);

    if (!match?.[1]) {
        throw new Error("Failed to retrieve CSRF token.");
    }

    return match[1].replace(/&#x2B;/g, "+");
};

export async function roblox(
    username: string,
    collection?: Map<string, any>,
    proxy?: IProxyConfig
): Promise<IResponse> {
    try {
        if (username.length < 3 || username.length > 20) {
            return {
                platform: "roblox",
                username,
                available: false,
                message: status_codes[3].message,
                error: null,
                suggestions: null
            };
        }

        const code = await validateRobloxUsername(username, proxy);
        const available = code === 0;

        let suggestions: string[] | null = null;

        if (!available && collection?.get("suggestions.enabled")) {
            const amount = collection.get("suggestions.amount") ?? 1;
            const verify = collection.get("suggestions.verification") === true;

            const candidates = generateSuggestions(username);
            suggestions = [];

            for (const candidate of candidates) {
                if (suggestions.length >= amount) break;

                if (!verify) {
                    suggestions.push(candidate);
                    continue;
                }

                const candidateCode = await validateRobloxUsername(candidate, proxy);
                if (candidateCode === 0) {
                    suggestions.push(candidate);
                }
            }
        }

        return {
            platform: "roblox",
            username,
            available,
            message: status_codes[code]?.message ?? "Unknown response",
            error: null,
            suggestions: suggestions?.join(", ") ?? null
        };
    } catch (error: any) {
        return {
            platform: "roblox",
            username,
            available: null,
            message: error.message || "Error",
            error: error?.message ?? error,
            suggestions: null
        };
    }
}
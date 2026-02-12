import { fetch } from "undici";
import { getProxyAgent, type IProxyConfig } from "../../core/proxy.js";
import { generateSuggestions } from "../../utils/generate.js";
import type { IResponse } from "../../core/client.js";

const isValidTikTokUsername = (name: string): boolean => /^[a-zA-Z0-9._]{1,24}$/.test(name);

const check = async (name: string, proxy?: IProxyConfig): Promise<boolean> => {
    const agent = getProxyAgent(proxy);

    try {
        const res = await fetch(`https://www.tiktok.com/@${encodeURIComponent(name)}`, {
            method: "GET",
            dispatcher: agent,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.9",
                "Referer": "https://www.tiktok.com/",
            },
        });

        if (res.status === 404) return false;
        if (res.status !== 200) return false;

        const html = await res.text();

        return html.includes('"userDetail"') || html.includes('"user":{') || !html.includes('404');

    } catch {
        return false;
    }
};

export async function tiktok(
    username: string,
    collection?: Map<string, any>,
    proxy?: IProxyConfig
): Promise<IResponse> {
    try {
        if (!isValidTikTokUsername(username)) {
            return {
                platform: "tiktok",
                username,
                available: false,
                message: "Invalid username",
                error: null,
                suggestions: null,
            };
        }

        const exists = await check(username, proxy);
        const available = !exists;

        let suggestions: string[] | null = null;
        if (!available && collection?.get("suggestions.enabled")) {
            const amount = collection.get("suggestions.amount") ?? 3;
            const verify = collection.get("suggestions.verification") === true;
            const candidates = generateSuggestions(username);
            suggestions = [];

            for (const candidate of candidates) {
                if (suggestions.length >= amount) break;
                if (!isValidTikTokUsername(candidate)) continue;

                if (!verify) {
                    suggestions.push(candidate);
                    continue;
                }

                const candidateExists = await check(candidate, proxy);
                if (!candidateExists) {
                    suggestions.push(candidate);
                }
            }
        }

        return {
            platform: "tiktok",
            username,
            available,
            message: available
                ? "Username is available"
                : "Username unavailable",
            error: null,
            suggestions: suggestions?.join(", ") ?? null,
        };

    } catch (error: any) {
        return {
            platform: "tiktok",
            username,
            available: null,
            message: error.message || "Error",
            error: error?.message ?? error,
            suggestions: null,
        };
    }
}

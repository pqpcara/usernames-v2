import { fetch } from "undici";
import { getProxyAgent, type IProxyConfig } from "../core/proxy.js";
import { generateSuggestions } from "../utils/generate.js";
import { roblox } from "./roblox.js";
import type { IResponse } from "../core/client.js";

export async function minecraft(
    username: string,
    collection?: Map<string, any>,
    proxy?: IProxyConfig
): Promise<IResponse> {
    const agent = getProxyAgent(proxy);

    const isValidUsername = (name: string) => /^[a-zA-Z0-9_]{3,16}$/.test(name);

    const check = async (name: string): Promise<boolean> => {
        try {
            const res = await fetch(
                `https://api.mojang.com/users/profiles/minecraft/${name}`,
                { method: "GET", dispatcher: agent }
            );
            return res.status === 200;
        } catch {
            return false;
        }
    };

    try {
        if (!isValidUsername(username)) {
            return {
                platform: "minecraft",
                username,
                available: false,
                message: "Invalid username",
                error: null,
                suggestions: null
            };
        }

        const robloxResult = await roblox(username, collection, proxy);

        if (robloxResult.available === false && robloxResult.message.includes("not appropriate")) {
            return {
                platform: "minecraft",
                username,
                available: false,
                message: "Username unavailable",
                error: null,
                suggestions: null
            };
        }

        const exists = await check(username);
        const available = !exists;

        let suggestions: string[] | null = null;
        if (!available && collection?.get("suggestions.enabled")) {
            const amount = collection.get("suggestions.amount") ?? 1;
            const verify = collection.get("suggestions.verification") === true;

            const candidates = generateSuggestions(username);
            suggestions = [];

            for (const candidate of candidates) {
                if (suggestions.length >= amount) break;
                if (!isValidUsername(candidate)) continue;

                if (!verify) {
                    suggestions.push(candidate);
                    continue;
                }

                const robloxCandidateResult = await roblox(candidate, collection, proxy);
                if (robloxCandidateResult.available === false && robloxCandidateResult.message.includes("not appropriate")) {
                    continue;
                }

                const candidateExists = await check(candidate);
                if (!candidateExists) {
                    suggestions.push(candidate);
                }
            }
        }

        return {
            platform: "minecraft",
            username,
            available,
            message: available
                ? "Username is available"
                : "Username unavailable",
            error: null,
            suggestions: suggestions?.join(", ") ?? null
        };
    } catch (error: any) {
        return {
            platform: "minecraft",
            username,
            available: null,
            message: error.message || "Error",
            error: error?.message ?? error,
            suggestions: null
        };
    }
}
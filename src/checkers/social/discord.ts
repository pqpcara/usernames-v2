import { fetch } from "undici";
import { getProxyAgent, type IProxyConfig } from "../../core/proxy.js";
import { generateSuggestions } from "../../utils/generate.js";
import type { IResponse } from "../../core/client.js";

const status_codes: Record<number, { code: number; message: string }> = {
  0: { code: 0, message: "Username is valid" },
  1: { code: 1, message: "Username is already in use" },
  2: { code: 2, message: "Invalid username format" },
  3: { code: 3, message: "Error" }
};

const validateDiscordUsername = async (
  username: string,
  proxy?: IProxyConfig
): Promise<{ code: number; available: boolean }> => {
  const agent = getProxyAgent(proxy);

  try {
    const response = await fetch(
      "https://discord.com/api/v9/unique-username/username-attempt-unauthed",
      {
        method: "POST",
        dispatcher: agent,
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) discord/1.0.9171 Chrome/128.0.6613.186 Electron/32.2.2 Safari/537.36",
          "Accept": "application/json",
          "Accept-Language": "en-US,en;q=0.9"
        },
        body: JSON.stringify({
          username: username
        })
      }
    );

    const data: any = await response.json();

    if (data.taken === false) {
      return { code: 0, available: true };
    }

    if (data.taken === true) {
      return { code: 1, available: false };
    }

    return { code: 3, available: false };
  } catch (error: any) {
    throw error;
  }
}

export async function discord(
  username: string,
  collection?: Map<string, any>,
  proxy?: IProxyConfig
): Promise<IResponse> {
  try {
    const { code, available } = await validateDiscordUsername(username, proxy);

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

        const { available: candidateAvailable } = await validateDiscordUsername(candidate, proxy);
        if (candidateAvailable) {
          suggestions.push(candidate);
        }
      }
    }

    return {
      platform: "discord",
      username,
      available,
      message: status_codes[code]?.message ?? "Unknown response",
      error: null,
      suggestions: suggestions?.join(", ") ?? null
    };

  } catch (error: any) {
    return {
      platform: "discord",
      username,
      available: null,
      message: error?.message ?? "Error",
      error: error?.message ?? error,
      suggestions: null
    };
  }
}

import { fetch } from "undici";
import { getProxyAgent, type IProxyConfig } from "../../core/proxy.js";
import { generateSuggestions } from "../../utils/generate.js";
import type { IResponse } from "../../core/client.js";

const isValidInstagramUsername = (name: string): boolean => /^[a-zA-Z0-9._]{1,30}$/.test(name);

const check = async (name: string, proxy?: IProxyConfig): Promise<boolean> => {
  const agent = getProxyAgent(proxy);

  try {
    const res = await fetch(`https://i.instagram.com/api/v1/users/web_profile_info/?username=${encodeURIComponent(name)}`, {
      method: "GET",
      dispatcher: agent,
      headers: {
        "User-Agent": "Instagram 322.0.0.0.0 Android (33/13; 480dpi; 1080x2340; samsung; SM-G998B; hero2lte; exynos9825; pt_BR; 567890123)",
        "Accept": "*/*",
        "X-IG-App-ID": "936619743392459",
        "X-ASBD-ID": "129477",
        "X-IG-Connection-Type": "WIFI",
        "X-IG-Capabilities": "3brTvw==",
        "Origin": "https://www.instagram.com",
        "Referer": "https://www.instagram.com/",
      },
    });

    if (res.status === 200) {
      return !!(await res.json() as any)?.data?.user;
    }

    return false;

  } catch {
    return false;
  }
};

export async function instagram(
  username: string,
  collection?: Map<string, any>,
  proxy?: IProxyConfig
): Promise<IResponse> {
  try {
    if (!isValidInstagramUsername(username)) {
      return {
        platform: "instagram",
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
        if (!isValidInstagramUsername(candidate)) continue;

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
      platform: "instagram",
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
      platform: "instagram",
      username,
      available: null,
      message: error.message || "Error",
      error: error?.message ?? error,
      suggestions: null,
    };
  }
}

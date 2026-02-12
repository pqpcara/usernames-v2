import { fetch } from "undici";
import { getProxyAgent, type IProxyConfig } from "../../core/proxy.js";
import type { IResponse } from "../../core/client.js";

const status_codes: Record<number, { code: number; message: string }> = {
  0: { code: 0, message: "Username is valid" },
  1: { code: 1, message: "Username is already in use" },
  2: { code: 2, message: "Usernames can be 1 to 39 characters long" },
  3: { code: 3, message: "Error" }
};

const extractSuggestions = (html: string): string[] | null => {
  const matches = [
    ...html.matchAll(
      /class="js-suggested-username"[^>]*value="([^"]+)"/g
    )
  ];

  if (!matches.length) return null;

  return matches.map(m => m[1]);
};

const parseGithubHtml = (
  html: string
): { code: number; suggestions: string[] | null } => {
  const text = html.replace(/\s+/g, " ").trim().toLowerCase();

  if (text.includes("is available")) {
    return {
      code: 0,
      suggestions: extractSuggestions(html)
    };
  }

  if (text.includes("is not available")) {
    return {
      code: 1,
      suggestions: extractSuggestions(html)
    };
  }

  return {
    code: 3,
    suggestions: null
  };
};

const validateGithubUsername = async (
  username: string,
  proxy?: IProxyConfig
): Promise<{ code: number; suggestions: string[] | null }> => {
  const agent = getProxyAgent(proxy);

  const response = await fetch(
    `https://github.com/signup_check_new/username?value=${encodeURIComponent(username)}`,
    {
      method: "GET",
      dispatcher: agent,
      credentials: "include",
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "*/*",
        "Referer": "https://github.com/signup",
        "Cache-Control": "no-cache",
        "Pragma": "no-cache"
      }
    }
  );

  const html = await response.text();

  return parseGithubHtml(html);
};

export async function github(
  username: string,
  collection?: Map<string, any>,
  proxy?: IProxyConfig
): Promise<IResponse> {
  try {
    const { code, suggestions } = await validateGithubUsername(username, proxy);
    const available = code === 0;

    return {
      platform: "github",
      username,
      available,
      message: status_codes[code]?.message ?? "Unknown response",
      error: null,
      suggestions: suggestions?.join(", ") ?? null
    };

  } catch (error: any) {
    return {
      platform: "github",
      username,
      available: null,
      message: error?.message ?? "Error",
      error: error?.message ?? error,
      suggestions: null
    };
  }
}

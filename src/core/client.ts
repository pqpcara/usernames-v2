import { discord } from "../checkers/social/discord.js";
import { instagram } from "../checkers/social/instagram.js";
import { tiktok } from "../checkers/social/tiktok.js";
import { youtube } from "../checkers/social/youtube.js";
import { soloto } from "../checkers/social/soloto.js";
import { github } from "../checkers/games/github.js";
import { minecraft } from "../checkers/games/minecraft.js";
import { roblox } from "../checkers/games/roblox.js";
import { xbox } from "../checkers/games/xbox.js";
import { steam } from "../checkers/games/steam.js";
import { ProxyManager } from "./proxy.js";

export interface IResponse {
    platform: string;
    username: string;
    available: boolean | null;
    message: string;
    error?: string | null;
    suggestions?: string | null;
}

interface IClientOptions {
    suggestions?: {
        enabled?: boolean;
        amount?: number;
        verification?: boolean;
    };
}

export class Client {
    public proxy = new ProxyManager();
    public collection = new Map<string, any>();

    constructor(options: IClientOptions = {}) {
        if (options.suggestions?.enabled !== undefined)
            this.collection.set("suggestions.enabled", options.suggestions.enabled);

        if (options.suggestions?.amount)
            this.collection.set("suggestions.amount", Number(options.suggestions.amount));

        if (options.suggestions?.verification !== undefined)
            this.collection.set("suggestions.verification", options.suggestions.verification);
    }

    // Games
    public async roblox(username: string): Promise<IResponse> {
        const proxy = this.proxy.random() ?? undefined;
        return await roblox(username, this.collection, proxy);
    }

    public async minecraft(username: string): Promise<IResponse> {
        const proxy = this.proxy.random() ?? undefined;
        return await minecraft(username, this.collection, proxy);
    }

    public async github(username: string): Promise<IResponse> {
        const proxy = this.proxy.random() ?? undefined;
        return await github(username, this.collection, proxy);
    }

    public async xbox(username: string): Promise<IResponse> {
        const proxy = this.proxy.random() ?? undefined;
        return await xbox(username, this.collection, proxy);
    }

    public async steam(username: string): Promise<IResponse> {
        const proxy = this.proxy.random() ?? undefined;
        return await steam(username, this.collection, proxy);
    }

    // Social Media
    public async instagram(username: string): Promise<IResponse> {
        const proxy = this.proxy.random() ?? undefined;
        return await instagram(username, this.collection, proxy);
    }

    public async discord(username: string): Promise<IResponse> {
        const proxy = this.proxy.random() ?? undefined;
        return await discord(username, this.collection, proxy);
    }

    public async tiktok(username: string): Promise<IResponse> {
        const proxy = this.proxy.random() ?? undefined;
        return await tiktok(username, this.collection, proxy);
    }

    public async youtube(username: string): Promise<IResponse> {
        const proxy = this.proxy.random() ?? undefined;
        return await youtube(username, this.collection, proxy);
    }

    public async soloto(username: string): Promise<IResponse> {
        const proxy = this.proxy.random() ?? undefined;
        return await soloto(username, this.collection, proxy);
    }
}

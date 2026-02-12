import { discord } from "../checkers/discord.js";
import { github } from "../checkers/github.js";
import { instagram } from "../checkers/instagram.js";
import { minecraft } from "../checkers/minecraft.js";
import { roblox } from "../checkers/roblox.js";
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

    public async instagram(username: string): Promise<IResponse> {
        const proxy = this.proxy.random() ?? undefined;
        return await instagram(username, this.collection, proxy);
    }

    public async discord(username: string): Promise<IResponse> {
        const proxy = this.proxy.random() ?? undefined;
        return await discord(username, this.collection, proxy);
    }
}
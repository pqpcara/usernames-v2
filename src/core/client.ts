import { roblox, type IRoblox } from "../checkers/roblox.js";
import { ProxyManager } from "./proxy.js";

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

    public async roblox(username: string): Promise<IRoblox> {
        const proxy = this.proxy.random() ?? undefined;
        return await roblox(username, this.collection, proxy);
    }
}
import { ProxyAgent } from "undici";

export interface IProxyConfig {
    host: string;
    port: number;
    username?: string;
    password?: string;
}

export interface IProxy {
    proxy?: {
        enabled?: boolean;
        proxies?: IProxyConfig[];
    };
}

class ProxyCollection<T> {
    private items: T[] = [];

    constructor (initial?: readonly T[]) {
        if (initial) this.items = [...initial];
    }

    add(item: T): this {
        this.items.push(item);
        return this;
    }

    list(): readonly T[] {
        return this.items;
    }

    clear(): this {
        this.items = [];
        return this;
    }

    get size(): number {
        return this.items.length;
    }
}

export class ProxyManager {
    private _enabled = false;
    private readonly _proxies = new ProxyCollection<IProxyConfig>();

    enabled(value?: boolean): boolean | this {
        if (value === undefined) return this._enabled;
        this._enabled = value;
        return this;
    }

    get proxies(): ProxyCollection<IProxyConfig> {
        return this._proxies;
    }

    random(): IProxyConfig | null {
        if (!this._enabled || this._proxies.size === 0) return null;
        const list = this._proxies.list();
        return list[Math.floor(Math.random() * list.length)];
    }
}

export const getProxyAgent = (proxy?: IProxyConfig) => {
    if (!proxy) return undefined;

    const auth =
        proxy.username && proxy.password
            ? `${proxy.username}:${proxy.password}@`
            : "";

    const uri = `http://${auth}${proxy.host}:${proxy.port}`;
    return new ProxyAgent(uri);
}
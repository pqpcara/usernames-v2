interface IProxyConfig {
    host: string;
    port: number;
    username?: string;
    password?: string;
};

export interface IProxy {
    proxy?: {
        enabled?: boolean;
        proxies?: IProxyConfig[];
    };
};

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
        if (value === undefined) {
            return this._enabled;
        }

        this._enabled = value;
        return this;
    }

    get proxies(): ProxyCollection<IProxyConfig> {
        return this._proxies;
    }
}
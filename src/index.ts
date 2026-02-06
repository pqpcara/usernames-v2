import { Client } from "./core/client.js";

export { Client } from "./core/client.js";

const client = new Client({
    suggestions: {
        enabled: true,
        amount: 5,
        verification: true
    }
});

const result = await client.roblox("fa1hou");
console.log(result);
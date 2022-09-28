import { Client, GatewayIntentBits, Partials } from "discord.js";
import { exit } from "process";
import { registerCommandListeners } from "./commands/commands";

export async function startBot() {
    const client = new Client({
        intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
        allowedMentions: { parse: ["users", "roles"], repliedUser: true }
    })



    client.login(process.env.DISCORD_TOKEN)
        .then(async () => {
            console.debug("Connected to Discord")
            await registerListeners(client)
        })
        .catch((err) => {
            console.error("Failed to connect to Discord", err)
            exit(-1)
        })
}


function registerListeners(client: Client) {
    registerCommandListeners(client)
}
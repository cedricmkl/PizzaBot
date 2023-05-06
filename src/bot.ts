import { Client, GatewayIntentBits } from "discord.js";
import { exit } from "process";
import { getTag } from "./database/database";
import { registerNitroColorListener } from "./interactions/command/color.command";
import { registerInteractions } from "./interactions/interactions";
import { errorEmbed } from "./util/embeds";

export async function startBot() {
    const client = new Client({
        intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent],
        allowedMentions: { parse: [], repliedUser: false, }
    })

    client.login(process.env.DISCORD_TOKEN)
        .then(async () => {
            console.log("Connected to Discord")
            await registerListeners(client)
        })
        .catch((err) => {
            console.error("Failed to connect to Discord", err)
            exit(-1)
        })
}


function registerListeners(client: Client) {
    registerInteractions(client)
    registerNitroColorListener(client)


    //will be removed in some time
    client.on("messageCreate", async (message) => {
        if (message.author.bot) return
        if (!message.content.toLowerCase().startsWith("tag") || message.content.split(" ").length < 2) return
        const input = message.content.split(" ")[1]
        const tag = await getTag(input)

        if (!tag) {
            await message.reply({ embeds: [errorEmbed("Fehler", "Der Tag wurde nicht gefunden.")] })
            return
        }
        await message.reply(tag.content)
    })

    client.on("threadCreate", function(thread, newlyCreated) {
        const embed = new EmbedBuilder()
        embed.setTitle("Willkommen im Support-Thread!")
        embed.setDescription("Hier kann dir nun von den anderen Mitgliedern des Servers geholfen werden.\nBitte schick uns schonmal deinen Code und deinen Fehler und warte dann ab.")
    
        if(newlyCreated) {
            thread.send({embeds: [embed]})
        }
    })
}

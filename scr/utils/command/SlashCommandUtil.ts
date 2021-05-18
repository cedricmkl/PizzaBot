import {Client} from "discord.js";

export default class SlashCommandUtil {
    static createGuildCommand(client: Client, guildID: String, data: any) {
        // @ts-ignore
         client.api.applications(client.user.id).guilds(guildID).commands.post({
            data: data
        })
    }
}
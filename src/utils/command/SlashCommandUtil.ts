import {APIMessageContentResolvable, Client, MessageEmbed} from "discord.js";

export default class SlashCommandUtil {
    static createGuildCommand(client: Client, guildID: String, data: any) {
        // @ts-ignore
        return client.api.applications(client.user.id).guilds(guildID).commands.post({
            data: data
        })
    }

    static overridePermissions(client: Client, guildID: String, commandID: String, roles: String[]) {
        const permissions = [];

        roles.forEach(value => {
            permissions.push({
                id: value,
                type: 1,
                permission: true
            })
        })

        // @ts-ignore
        return client.api.applications(client.user.id).guilds(guildID).commands(commandID).permissions.put({
            data: {
                permissions: permissions
            }
        })
    }

    static sendThinking(client: Client, interactionID: String, interactionToken: String){
        // @ts-ignore
        return client.api.interactions(interactionID, interactionToken).callback.post({
            data: {
                type: 5
            }
        })
    }

    static sendUserMessage(client: Client, interactionID: String, interactionToken: String, message: MessageEmbed | APIMessageContentResolvable){
        // @ts-ignore
        return client.api.interactions(interactionID,interactionToken).callback.post({
            data: {
                type: 4,
                data: {
                    content: message,
                    flags: 64
                }
            }
        })
    }
}
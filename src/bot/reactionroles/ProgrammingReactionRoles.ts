//OLD CODE
import {Client, MessageEmbed} from "discord.js";
import {readFileSync} from "fs";

export default class ProgrammingReactionRoles {
    client: Client
    reactionRolesConfig: ReactionRolesConfig = JSON.parse(readFileSync('data/programmingReactionRoles.json', 'utf8'))

    constructor(client: Client) {
        this.client = client;
        this.client.on('message', async (msg) => {
            if (msg.content && msg.guild && !msg.author.bot && msg.member.permissions.has('ADMINISTRATOR') && msg.content.startsWith('!reactionroles')) {
                await msg.delete()
                let messageID: string = this.reactionRolesConfig.message;

                if (messageID) {
                    await msg.channel.messages.fetch()
                    const oldMessage = await msg.channel.messages.cache.get(messageID)
                    oldMessage.edit(this.createEmbed())

                    for (const role of this.reactionRolesConfig.roles) {
                        oldMessage.react(role.emote)
                    }
                }
            }
        })

        this.client.on("messageReactionAdd", async (reaction, user) => {
            if (reaction.message.partial) await reaction.fetch();
            if (reaction.partial) await reaction.fetch();
            if (user.bot || !reaction.message.guild) return;


            for (let index = 0; index < this.reactionRolesConfig.roles.length; index++) {
                let reactionRole = this.reactionRolesConfig.roles[index];


                if (reaction.message.id == this.reactionRolesConfig.message && reactionRole.emote.includes(reaction.emoji.name)) {
                    await reaction.message.guild.members.cache.get(user.id).roles.add(reactionRole.role)
                    await reaction.message.guild.members.cache.get(user.id).roles.add('814515884180635699')

                }
            }
        })

        this.client.on("messageReactionRemove", async (reaction, user) => {
            if (reaction.message.partial) await reaction.fetch();
            if (reaction.partial) await reaction.fetch();
            if (user.bot || !reaction.message.guild) return;

            for (let index = 0; index < this.reactionRolesConfig.roles.length; index++) {
                let reactionRole = this.reactionRolesConfig.roles[index];

                if (reaction.message.id == this.reactionRolesConfig.message && reactionRole.emote.includes(reaction.emoji.name)) {
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(reactionRole.role)
                }
            }
        })
    }


    createEmbed(): MessageEmbed {
        const content = []
        for (let index = 0; index < this.reactionRolesConfig.roles.length; index++) {
            let reactionRole = this.reactionRolesConfig.roles[index];
            content.push('\n' + reactionRole.name + " - " + reactionRole.emote)
        }

        let s = "Hier kannst du einstellen was du für Rollen haben willst \n"
        content.forEach(string => {
            s = s + string;
        })
        return new MessageEmbed({title: "Rollen", description: s, color: "GREEN"})
    }
}

interface ReactionRolesConfig {
    message: string;
    roles: Array<{
        emote: any,
        role: any,
        name: string
    }>
}
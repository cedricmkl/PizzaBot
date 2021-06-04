import Command from "../Command";
import {Client, GuildMember, Message} from "discord.js";
import TagProvider from "../../provider/TagProvider";


export default class TagsCommand extends Command {

    constructor() {
        super("tags", "Zeigt alle verfügbaren Tags an", true);
    }

    async executeSlash(client, command) {
        await command.defer()

        const tags = await this.getTags()
        await command.editReply(tags)
    }

    async executeText(client: Client, args: string[], member: GuildMember, message: Message) {
        const tags = await this.getTags()
        await message.channel.send(tags);
    }

    async getTags(): Promise<string> {
        const tags = await TagProvider.getTags();
        return `Alle verfügbaren Tags: ${tags.map(value => "`" + value.name + "`").join(", ")}`
    }

}
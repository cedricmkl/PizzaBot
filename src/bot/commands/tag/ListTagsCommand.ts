import Command from "../../command/Command";
import {Client, GuildMember, Message} from "discord.js";
import CommandArguments from "../../command/CommandArguments";
import CommandActionExecutor from "../../command/CommandActionExecutor";
import TagProvider from "../../provider/TagProvider";


export default class ListTagsCommand extends Command{

    constructor() {
        super("list-tags", "Zeigt alle verfügbaren Tags an", true);
        this.withAliases(["tags"])
    }

    async executeSlash(client: Client, member: GuildMember, args: CommandArguments, executor: CommandActionExecutor) {
        await executor.sendThinking()

        const tags = await this.getTags()
        await executor.sendWebhookMessage(tags)
    }

    async executeText(client: Client, args: string[], member: GuildMember, message: Message) {
        const tags = await this.getTags()
        await message.channel.send(tags);
    }

    async getTags() : Promise<string> {
        const tags = await TagProvider.getTags();
        return `Alle verfügbaren Tags: ${tags.map(value => "`" + value.name + "`").join(", ")}`
    }

}
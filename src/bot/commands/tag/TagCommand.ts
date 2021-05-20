import Command from "../../command/Command";
import {Client, GuildMember, Message} from "discord.js";
import {CommandParameterType} from "../../command/CommandParameterType";
import CommandArguments from "../../command/CommandArguments";
import CommandActionExecutor from "../../command/CommandActionExecutor";
import TagProvider from "../../provider/TagProvider";


export default class TagCommand extends Command{

    constructor() {
        super("tag", "Einen Tag in den Channel senden", true);
        this.withParameter("name", "Name des Tags", CommandParameterType.STRING, true)
        this.withAliases(["tags"])
        this.withRoles(["823462677425815552"])
    }

    async executeSlash(client: Client, member: GuildMember, args: CommandArguments, executor: CommandActionExecutor) {
        await executor.sendThinking()
        const name: string = args.getArgument("name").getAsString();
        const tag = await TagProvider.getTag(name);
        if (!tag?.created) {
            executor.sendWebhookMessage(`<@${member.user.id}>, Der Tag existiert nicht`)
            return;
        }

        await executor.sendWebhookMessage(tag.content)
    }

    async executeTextCommand(client: Client, args: string[], member: GuildMember, message: Message) {
        const name = args[0];
        if (!name) return message.channel.send("Nutze `tag <name>`")
        const tag = await TagProvider.getTag(name);
        if (!tag?.created) {
            message.reply("Der Tag existiert nicht")
            return;
        }
        await message.channel.send(tag.content);
    }

}
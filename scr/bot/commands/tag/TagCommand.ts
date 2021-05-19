import Command from "../../command/Command";
import {Client, GuildMember, Message} from "discord.js";
import {CommandParameterType} from "../../command/CommandParameterType";
import CommandArguments from "../../command/CommandArguments";
import CommandActionExecutor from "../../command/CommandActionExecutor";


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
        const content = await this.getTag(name);
        await executor.sendWebhookMessage(content)
    }

    async executeTextCommand(client: Client, args: string[], member: GuildMember, message: Message) {
        const name = args[0];
        if (!name) return message.channel.send("Nutze `tag <name>`")
        const tag = await this.getTag(name);
        await message.channel.send(tag);
    }

    private async getTag(name: string) : Promise<string>{
        return await "Tag from Database"
    }
}
import Command from "../../command/Command";
import {Client, GuildMember, Message} from "discord.js";
import {CommandParameterType} from "../../command/CommandParameterType";
import CommandArguments from "../../command/CommandArguments";
import CommandActionExecutor from "../../command/CommandActionExecutor";
import TagProvider from "../../provider/TagProvider";


export default class DeleteTagCommand extends Command{

    constructor() {
        super("delete-tag", "Einen bereits existierenden Tag löschen", true);
        this.withParameter("name", "Name des Tags", CommandParameterType.STRING, true)
        this.withRoles([process.env.MOD_ROLE])
    }

    async executeSlash(client: Client, member: GuildMember, args: CommandArguments, executor: CommandActionExecutor) {
        await executor.sendThinking()
        const name: string = args.getArgument("name").getAsString().toLowerCase();

        const result = await this.deleteTag(member, name);
        await executor.sendWebhookMessage(result)
    }

    async executeText(client: Client, args: string[], member: GuildMember, message: Message) {
        if (args.length < 1) return message.channel.send("Nutze `" + process.env.PREFIX + "delete-tag <name> `")
        const name = args[0].toLowerCase();

        const result = await this.deleteTag(member, name);
        await message.reply(result)
    }

    async deleteTag(member: GuildMember, name: string) : Promise<string>{
        if (name.includes(" ")) return "Der Tag-Name kann keine Leerzeichen enthalten"

        const tag = await TagProvider.getTag(name);
        if (!tag) return "Der Tag existiert nicht"

        await tag.delete();
        return "Tag erfolgreich gelöscht!"
    }
}
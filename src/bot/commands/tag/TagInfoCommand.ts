import Command from "../../command/Command";
import {Client, GuildMember, Message, MessageEmbed} from "discord.js";
import {CommandParameterType} from "../../command/CommandParameterType";
import CommandArguments from "../../command/CommandArguments";
import CommandActionExecutor from "../../command/CommandActionExecutor";
import TagProvider from "../../provider/TagProvider";


export default class TagInfoCommand extends Command{

    constructor() {
        super("tag-info", "Informationen zu einem Tag anfordern", true);
        this.withParameter("name", "Name des Tags", CommandParameterType.STRING, true)
    }

    async executeSlash(client: Client, member: GuildMember, args: CommandArguments, executor: CommandActionExecutor) {
        await executor.sendThinking()
        const name: string = args.getArgument("name").getAsString();

        const result = await this.getTagInfo(member, name)
        await executor.sendWebhookMessage(result)
    }

    async executeText(client: Client, args: string[], member: GuildMember, message: Message) {
        if (args.length < 1) return message.channel.send("Nutze `tag <name>`")
        const name = args[0];

        const result = await this.getTagInfo(member, name)
        await message.channel.send(result);
    }

    async getTagInfo(member: GuildMember, name: string) : Promise<MessageEmbed | string>{
        if (name.includes(" ")) return "Der Tag-Name und der Tag-Alias kann keine Leerzeichen enthalten"
        const tag = await TagProvider.getTag(name);
        if (!tag) return "Der Tag existiert nicht"

        const aliases = tag.aliases.length > 0 ? tag.aliases.map(value => "`" + value + "`").join(", ") : "keine"

        return new MessageEmbed({color: "#03f8fc", title: `Tag ${tag.name}`, fields: [
                {
                    name: "Aliases",
                    value: aliases,
                    inline: true
                },
                {
                    name: "Erstellt",
                    value: "`" + tag.createdAt.toLocaleString() + "`",
                    inline: true
                }
            ]})
    }

}
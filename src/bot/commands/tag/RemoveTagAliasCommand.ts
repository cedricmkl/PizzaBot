import Command from "../Command";
import {Client, GuildMember, Message} from "discord.js";
import {CommandParameterType} from "../CommandParameterType";
import TagProvider from "../../provider/TagProvider";


export default class RemoveTagAliasCommand extends Command{

    constructor() {
        super("remove-alias", "Einen bereits existierenden Tag einen Alias entfernen", true);
        this.withParameter({ name: "name", description: "Name des Tags", type: CommandParameterType.STRING, required: true })
        this.withParameter({ name: "alias", description: "Der Alias des Tags", type: CommandParameterType.STRING, required: true })
        this.withRoles([process.env.MOD_ROLE])
    }

    async executeSlash(client, command) {
        await command.defer()
        const name: string = command.options.find(value => value.name == "name").value
        const alias: string = command.options.find(value => value.name == "alias").value

        const result = await this.deleteTagAlias(command.member, name.toLowerCase(), alias.toLowerCase());
        await command.reply(result)
    }

    async executeText(client: Client, args: string[], member: GuildMember, message: Message) {
        if (args.length < 2) return message.channel.send("Nutze `" + process.env.PREFIX + "create-alias <name> <alias>`")
        const name = args[0].toLowerCase();
        const alias = args[1].toLowerCase();

        const result = await this.deleteTagAlias(member, name, alias);
        await message.reply(result)
    }

    async deleteTagAlias(member: GuildMember, name: string, alias: string) : Promise<string>{
        if (name.includes(" ") || alias.includes(" ")) return "Der Tag-Name und der Tag-Alias kann keine Leerzeichen enthalten"
        const tag = await TagProvider.getTag(name);
        if (!tag) return "Der Tag existiert nicht"
        if (!tag.aliases.includes(alias)) return "Dieser Tag hat den Alias nicht"

        tag.aliases.splice(tag.aliases.indexOf(alias), 1)
        await tag.save();
        return "Tag Alias erfolgreich entfernt!"
    }
}
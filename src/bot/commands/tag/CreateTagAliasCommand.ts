import Command from "../Command";
import {Client, GuildMember, Message} from "discord.js";
import {CommandParameterType} from "../CommandParameterType";
import TagProvider from "../../provider/TagProvider";


export default class CreateTagAliasCommand extends Command{

    constructor() {
        super("create-alias", "Einen bereits existierenden Tag einen Alias hinzufügen", true);
        this.withParameter({ name: "name", description: "Name des Tags", type: CommandParameterType.STRING, required: true })
        this.withParameter({ name: "alias", description: "Der Alias, der für den Tag erstellt werden soll", type: CommandParameterType.STRING, required: true })
        this.withRoles([process.env.MOD_ROLE])
    }

    async executeSlash(client, command) {

    }

    async executeText(client: Client, args: string[], member: GuildMember, message: Message) {
        if (args.length < 2) return message.channel.send("Nutze `" + process.env.PREFIX + "create-alias <name> <alias>`")
        const name = args[0].toLowerCase();
        const alias = args[1].toLowerCase();

        const result = await this.createTagAlias(member, name, alias);
        await message.reply(result)
    }

    async createTagAlias(member: GuildMember, name: string, alias: string) : Promise<string>{
        if (name.includes(" ") || alias.includes(" ")) return "Der Tag-Name und der Tag-Alias kann keine Leerzeichen enthalten"
        const tag = await TagProvider.getTag(name);
        if (!tag) return "Der Tag existiert nicht"
        if (tag.aliases.includes(alias)) return "Dieser Tag hat den Alias schon"
        if (await TagProvider.exitsTag(alias)) return "Ein Tag mit dem Namen oder Alias existiert schon"


        tag.aliases.push(alias)
        await tag.save();
        return "Tag Alias erfolgreich erstellt!"
    }
}
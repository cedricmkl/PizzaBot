import Command from "../Command";
import {MessageEmbed} from "discord.js";
import {CommandParameterType} from "../CommandParameterType";
import TagProvider from "../../provider/TagProvider";


export default class TagInfoCommand extends Command {

    constructor() {
        super("tag-info", "Informationen zu einem Tag anfordern", false);
        this.withParameter({
            name: "name",
            description: "Name des Tags",
            type: CommandParameterType.STRING,
            required: true
        })
    }

    async executeSlash(client, command) {
        await command.defer()
        const name: string = command.options.find(value => value.name == "name").value

        const result = await this.getTagInfo(name.toLowerCase())
        await command.editReply(result)
    }

    async getTagInfo(name: string): Promise<MessageEmbed | string> {
        if (name.includes(" ")) return "Der Tag-Name und der Tag-Alias kann keine Leerzeichen enthalten"
        const tag = await TagProvider.getTag(name);
        if (!tag) return "Der Tag existiert nicht"

        const aliases = tag.aliases.length > 0 ? tag.aliases.map(value => "`" + value + "`").join(", ") : "keine"

        return new MessageEmbed({
            color: "#03f8fc", title: `Tag ${tag.name}`, fields: [
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
            ]
        })
    }

}
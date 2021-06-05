import Command from "../Command";
import {CommandParameterType} from "../CommandParameterType";
import TagProvider from "../../provider/TagProvider";


export default class CreateTagAliasCommand extends Command {

    constructor() {
        super("create-alias", "Einen bereits existierenden Tag einen Alias hinzufügen", false);
        this.withParameter({
            name: "name",
            description: "Name des Tags",
            type: CommandParameterType.STRING,
            required: true
        })
        this.withParameter({
            name: "alias",
            description: "Der Alias, der für den Tag erstellt werden soll",
            type: CommandParameterType.STRING,
            required: true
        })
        this.withRoles([process.env.MOD_ROLE])
    }

    async executeSlash(client, command) {
        await command.defer()
        const name: string = command.options.find(value => value.name == "name").value
        const alias: string = command.options.find(value => value.name == "alias").value

        const result = await this.createTagAlias(name, alias)
        await command.editReply(result)
    }


    async createTagAlias(name: string, alias: string): Promise<string> {
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
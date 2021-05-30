import Command from "../Command";
import {CommandParameterType} from "../CommandParameterType";
import TagProvider from "../../provider/TagProvider";


export default class DeleteTagCommand extends Command{

    constructor() {
        super("delete-tag", "Einen bereits existierenden Tag löschen", true);
        this.withParameter({
            name: "name",
            description: "Name des Tags",
            type: CommandParameterType.STRING,
            required: true
        })
        this.withRoles([process.env.MOD_ROLE])
    }

    async executeSlash(client, command) {
        await command.defer()
        const name: string = command.options.find(value => value.name == "name")
        const result = await this.deleteTag(name);
        await command.editReply(result)
    }

    async deleteTag(name: string): Promise<string> {
        if (name.includes(" ")) return "Der Tag-Name kann keine Leerzeichen enthalten"

        const tag = await TagProvider.getTag(name);
        if (!tag) return "Der Tag existiert nicht"

        await tag.delete();
        return "Tag erfolgreich gelöscht!"
    }
}
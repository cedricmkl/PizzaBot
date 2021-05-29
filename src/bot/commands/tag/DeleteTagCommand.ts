import Command from "../Command";
import {Client, GuildMember, Message} from "discord.js";
import {CommandParameterType} from "../CommandParameterType";
import TagProvider from "../../provider/TagProvider";


export default class DeleteTagCommand extends Command{

    constructor() {
        super("delete-tag", "Einen bereits existierenden Tag löschen", true);
        this.withParameter({ name: "name", description: "Name des Tags", type: CommandParameterType.STRING, required: true })
        this.withRoles([process.env.MOD_ROLE])
    }

    async executeSlash(client, command) {
        /*await executor.sendThinking()
        const name: string = args.getArgument("name").getAsString().toLowerCase();

        const result = await this.deleteTag(member, name);
        await executor.sendWebhookMessage(result)*/
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
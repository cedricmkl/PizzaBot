import {GuildMember, Message, Snowflake, Util} from "discord.js";
import {CommandParameterType} from "../CommandParameterType";
import TagProvider from "../../provider/TagProvider";
import PermissionsUtil from "../../../utils/PermissionsUtil";
import ComponentUtil from "../../../utils/ComponentUtil";
import CommandMessageHandler from "../CommandMessageHandler";


export default class EditTagCommand extends CommandMessageHandler {
    requests: Map<Snowflake, string> = new Map<Snowflake, string>()

    constructor() {
        super("edit-tag", "Einen bereits existierenden Tag editieren", true);
        this.withParameter({
            name: "name",
            description: "Name des Tags",
            type: CommandParameterType.STRING,
            required: true
        })
    }

    async executeSlash(client, command) {
        const name: string = command.options.find(value => value.name == "name").value
        this.requests.set(command.user.id, name.toLowerCase())
        await command.reply("Gebe den Content des Tags in deiner nächsten Nachricht an")
    }

    async editTag(member: GuildMember, name: string, content: string, message: Message) {
        if (name.includes(" ")) return "Der Tag-Name kann keine Leerzeichen enthalten"
        const tag = await TagProvider.getTag(name)
        if (!tag) return message.reply("Der Tag wurde nicht gefunden")
        if (!PermissionsUtil.canExecute([process.env.MOD_ROLE], member)) {
            const botMessage = await message.reply("Du kannst keinen Tag editieren, da du keine Rechte hast. Warte bis ein Teammitglied den **selbstgeschrieben** Tag akzeptiert.",
                {
                    components: [ComponentUtil.acceptRejectComponent({
                        label: "Tag Request akzeptieren",
                        customID: "acceptTagRequestEdit"
                    }, {label: "Tag Request ablehnen", customID: "rejectTagRequestEdit"})]
                })
            await TagProvider.createTagRequest(name, content, message.member, botMessage)
            return
        }
        tag.content = Util.removeMentions(content)
        await tag.save()
        return message.reply("Tag editiert!")
    }

    async handleMessage(message: Message) {
        const commandName = this.requests.get(message.author.id)
        if (!commandName) return
        if (message.content.length > 2000) return message.reply("Der Tag ist zu lang")
        this.requests.set(message.author.id, null)

        await this.editTag(message.member, commandName, message.content, message)
    }
}
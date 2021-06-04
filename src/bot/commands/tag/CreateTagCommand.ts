import {GuildMember, Message, Snowflake} from "discord.js";
import {CommandParameterType} from "../CommandParameterType";
import TagProvider from "../../provider/TagProvider";
import PermissionsUtil from "../../../utils/PermissionsUtil";
import CommandMessageHandler from "../CommandMessageHandler";
import ComponentUtil from "../../../utils/ComponentUtil";


export default class CreateTagCommand extends CommandMessageHandler {
    requests: Map<Snowflake, string> = new Map<Snowflake, string>()

    constructor() {
        super("create-tag", "Einen neuen Tag erstellen", true);
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

    async createTag(member: GuildMember, name: string, content: string, message: Message) {
        if (name.includes(" ")) return "Der Tag-Name kann keine Leerzeichen enthalten"
        if (!PermissionsUtil.canExecute([process.env.MOD_ROLE], member)) {
            const text = `Du kannst keinen Tag erstellen, da du keine Rechte hast. Warte bis ein Teammitglied den **selbstgeschrieben** Tag akzeptiert.`


            const botMessage = await message.reply("Du kannst keinen Tag erstellen, da du keine Rechte hast. Warte bis ein Teammitglied den **selbstgeschrieben** Tag akzeptiert.",
                {
                    components: [ComponentUtil.acceptRejectComponent({
                        label: "Tag Request akzeptieren",
                        customID: "acceptTagRequest"
                    }, {label: "Tag Request ablehnen", customID: "rejectTagRequest"})]
                })
            await TagProvider.createTagRequest(name, content, message.member, botMessage)
            return
        }

        try {
            await TagProvider.createTag(name, content)
            return message.reply("Tag erstellt!")
        } catch (error) {
            if (error.code === 11000) return message.reply(`Es existiert noch ein Tag mit dem Namen ${name}`)
            return message.reply("Der Tag konnte nicht erstellt werden")
        }
    }

    async handleMessage(message: Message) {
        const commandName = this.requests.get(message.author.id)
        if (!commandName) return
        if (message.content.length > 2000) return message.reply("Der Tag ist zu lang")
        this.requests.set(message.author.id, null)

        await this.createTag(message.member, commandName, message.content, message)
    }
}
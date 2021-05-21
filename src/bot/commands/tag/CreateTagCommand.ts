import Command from "../../command/Command";
import {Client, GuildMember, Message} from "discord.js";
import {CommandParameterType} from "../../command/CommandParameterType";
import CommandArguments from "../../command/CommandArguments";
import CommandActionExecutor from "../../command/CommandActionExecutor";
import TagProvider from "../../provider/TagProvider";
import PermissionsUtil from "../../../utils/PermissionsUtil";
import PasteUtil from "../../../utils/PasteUtil";


export default class CreateTagCommand extends Command{

    constructor() {
        super("create-tag", "Einen neuen Tag erstellen", true);
        this.withParameter("name", "Name des Tags", CommandParameterType.STRING, true)
        this.withParameter("content", "Content des Tags", CommandParameterType.STRING, true)
    }

    async executeSlash(client: Client, member: GuildMember, args: CommandArguments, executor: CommandActionExecutor) {
        await executor.sendThinking()
        const name: string = args.getArgument("name").getAsString().toLowerCase();
        const content: string = args.getArgument("content").getAsString();

        const result = await this.createTag(member, name, content);
        await executor.sendWebhookMessage(result)
    }

    async executeText(client: Client, args: string[], member: GuildMember, message: Message) {
        if (args.length < 2) return message.channel.send("Nutze `" + process.env.PREFIX + "create-tag <name> <content>`")

        const name = args[0].toLowerCase();
        args.shift();
        const content = args.join(" ")

        const result = await this.createTag(member, name, content);
        await message.reply(result)
    }

    async createTag(member: GuildMember, name: string, content: string) : Promise<string>{
        if (name.includes(" ")) return "Der Tag-Name kann keine Leerzeichen enthalten"
        if (!PermissionsUtil.canExecute([process.env.MOD_ROLE], member)) {
            let url = await PasteUtil.paste(content)

            return `Du kannst diesen Tag nicht erstellen, da du keine Rechte besitzt! Warte bis ein Teammitglied deinen Tag erstellt oder ablehnt!` +
                ` Beachte das dein Tag **selbstgeschrieben** sein muss! Einen Raw Version von deinem Tag wurde hier hochgeladen: ${url.replace(".md", "")}\n\n So würde dein Tag aussehen: \n${content}`
        }

        try {
            await TagProvider.createTag(name, content)
            return "Tag erstellt!"
        }catch (error) {
            if (error.code === 11000) return  `Es existiert noch ein Tag mit dem Namen ${name}`
            return "Der Tag konnte nicht erstellt werden"
        }
    }
}
import {Client, GuildMember, Message} from "discord.js";
import CommandParameter from "./CommandParameter";
import {CommandParameterType} from "./CommandParameterType";
import SlashCommandUtil from "../../utils/command/SlashCommandUtil";
import CommandArguments from "./CommandArguments";
import CommandActionExecutor from "./CommandActionExecutor";

export default abstract class Command {
    readonly name: String;
    readonly description: String;
    aliases: string[];
    executeWithOutPrefix: boolean;
    params: CommandParameter[];


    constructor(name: String, description: String, executeWithOutPrefix: boolean) {
        this.params = [];
        this.name = name;
        this.description = description;
        this.executeWithOutPrefix = executeWithOutPrefix;
        this.aliases = [];
    }

    withAliases(aliases: string[]) {
        this.aliases = aliases;
    }

    withParameter(name: String, description: String, type: CommandParameterType, required: boolean) {
        this.params = [...this.params, new CommandParameter(name, description, type, required)]
    }

    registerCommand(client: Client) {
        let options = [];
        this.params.forEach(value => {
            options.push(value.toOption())
        })

        SlashCommandUtil.createGuildCommand(client, process.env.GUILD, {
            name: this.name,
            description: this.description,
            options: options
        })
    }

    executeSlash(client: Client, member: GuildMember, args: CommandArguments, executor: CommandActionExecutor) {
        executor.sendUserMessage("Der Command ist nicht als Slash-Command implementiert")
    }
    executeTextCommand(client: Client, input: string[], member: GuildMember, message: Message) {
        message.reply("Der Command ist nicht als Text-Command implementiert")
    }
}
import {Client, GuildMember, Message} from "discord.js";
import CommandParameter from "./CommandParameter";
import {CommandParameterType} from "./CommandParameterType";
import SlashCommandUtil from "../../utils/command/SlashCommandUtil";
import CommandArguments from "./CommandArguments";
import CommandActionExecutor from "./CommandActionExecutor";
import PermissionsUtil from "../../utils/PermissionsUtil";
import {deflateRawSync} from "zlib";
import {unwatchFile} from "fs";

export default abstract class Command {
    readonly name: String;
    readonly description: String;
    aliases: string[];
    executeWithOutPrefix: boolean;
    params: CommandParameter[];
    roles: string[];


    protected constructor(name: String, description: String, executeWithOutPrefix: boolean) {
        this.params = [];
        this.name = name;
        this.description = description;
        this.executeWithOutPrefix = executeWithOutPrefix;
        this.aliases = [];
        this.roles = [];
    }

    withAliases(aliases: string[]) {
        this.aliases = aliases;
    }

    withRoles(roles: string[]) {
        this.roles = roles;
    }

    withParameter(name: String, description: String, type: CommandParameterType, required: boolean) {
        this.params = [...this.params, new CommandParameter(name, description, type, required)]
    }

    async registerSlashCommand(client: Client) {
        let options = [];
        this.params.forEach(value => {
            options.push(value.toOption())
        })

        const command = await SlashCommandUtil.createGuildCommand(client, process.env.GUILD, {
            name: this.name,
            description: this.description,
            options: options
        })

        if (command?.id) {
            SlashCommandUtil.overridePermissions(client, process.env.GUILD, command.id, this.roles)
        }
    }

    executeSlash(client: Client, member: GuildMember, args: CommandArguments, executor: CommandActionExecutor) {
        executor.sendUserMessage("Der Command ist nicht als Slash-Command implementiert")
    }

    executeText(client: Client, input: string[], member: GuildMember, message: Message) {
        message.reply("Der Command ist nicht als Text-Command implementiert")
    }

    checkTextCommand(input: String) : boolean {
        if (input.charAt(0) !== process.env.PREFIX && !this.executeWithOutPrefix) return false;
        const name = input.replace(process.env.PREFIX, "")
        return this.name === name || this.aliases.includes(name)
    }

    canExecute(member: GuildMember) : boolean {
        if (this.roles.length === 0) return true;
        return PermissionsUtil.canExecute(this.roles, member);
    }
}
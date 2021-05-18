import {Client, GuildMember} from "discord.js";
import CommandParameter from "./CommandParameter";
import {CommandParameterType} from "./CommandParameterType";
import SlashCommandUtil from "../../utils/command/SlashCommandUtil";
import CommandArguments from "./CommandArguments";

export default abstract class Command {
    params: CommandParameter[];
    readonly name: String;
    readonly description: String;


    constructor(name: String, description: String) {
        this.params = [];
        this.name = name;
        this.description = description;
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

    abstract execute(client: Client, member: GuildMember, args: CommandArguments)
}
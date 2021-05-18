import Command from "../../command/Command";
import {Client, GuildMember} from "discord.js";
import {CommandParameterType} from "../../command/CommandParameterType";
import CommandArguments from "../../command/CommandArguments";

export default class TagCommand extends Command {

    constructor() {
        super("tag", "Einen Tag in den Channel senden");
        this.withParameter("name", "Name des Tags", CommandParameterType.STRING, true)
        this.withParameter("iwas", "iwas/ des Tags", CommandParameterType.INTEGER, false)

    }

    execute(client: Client, member: GuildMember, args: CommandArguments) {
        console.log(args.getArgument("name").getAsString())
        console.log(args.getArgument("iwas").getAsInt())
    }
}
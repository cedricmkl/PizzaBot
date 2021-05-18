import Command from "../../command/Command";
import {Client, GuildMember} from "discord.js";
import {CommandParameterType} from "../../command/CommandParameterType";
import CommandArguments from "../../command/CommandArguments";

export default class TagCommand extends Command {

    constructor() {
        super("tag", "Einen Tag in den Channel senden");
        this.withParameter("name", "Name des Tags", CommandParameterType.STRING, true)

    }

    execute(client: Client, member: GuildMember, args: CommandArguments) {
        console.log(args.getArgument("name").getAsString())
    }
}
import {Snowflake} from "discord.js";
import SlashCommandArgument from "./SlashCommandArgument";
import SlashSubCommandArgument from "./SlashSubCommandArgument";

export default class SlashSubCommandGroupArgument extends SlashCommandArgument {

    constructor(
        name: string,
        description: string = "Keine Beschreibung",
        subCommands: SlashSubCommandArgument[],
        roles?: Snowflake[],
    ) {
        super("SUB_COMMAND_GROUP", name, description, null, roles, null, subCommands);
    }
}

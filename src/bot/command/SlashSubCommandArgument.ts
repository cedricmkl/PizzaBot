import {Snowflake} from "discord.js";
import SlashCommandArgument from "./SlashCommandArgument";

export default class SlashSubCommandArgument extends SlashCommandArgument {

    constructor(
        name: string,
        description: string = "Keine Beschreibung",
        options?: SlashCommandArgument[],
        roles?: Snowflake[],
    ) {
        super("SUB_COMMAND", name, description, null, roles, null, options);
    }
}

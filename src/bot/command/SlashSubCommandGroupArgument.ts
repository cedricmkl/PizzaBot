import {GuildMember, Snowflake} from "discord.js";
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

    hasPermission(member: GuildMember): boolean {
        if (this.roles == null) return true
        if (this.roles.length == 0) return true
        if (member.permissions.has("ADMINISTRATOR")) return true
        this.roles.forEach(role => {
            if (member.roles.cache.has(role)) return true
        })
        return false
    }
}

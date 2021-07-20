import {GuildMember, Snowflake} from "discord.js";

export default class PermissionsUtil {

    static canExecute(roles: Array<string>, member: GuildMember): boolean {
        if (roles.length == 0) return true
        if (member.permissions.has("ADMINISTRATOR")) return true;
        let hasRole = false;
        roles.forEach(value => {
            if (member.roles.cache.get(value as Snowflake) != null) {
                hasRole = true;
            }
        })
        return hasRole;
    }
}

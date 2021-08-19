import {GuildMember, Snowflake} from "discord.js";

export default class PermissionsUtil {

    static canExecute(roles: Array<Snowflake>, member: GuildMember): boolean {
        if (roles.length == 0) return true
        if (member.permissions.has("ADMINISTRATOR")) return true;
        let hasRole = false;
        roles.forEach(value => {
            if (member.roles.cache.get(value) != null) {
                hasRole = true;
            }
        })
        return hasRole;
    }
}

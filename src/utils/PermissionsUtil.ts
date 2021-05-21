import {GuildMember} from "discord.js";

export default class PermissionsUtil {

    static canExecute(roles: Array<string>, member: GuildMember) : boolean {
        if (member.hasPermission("ADMINISTRATOR")) return true;
        let hasRole = false;
        roles.forEach(value => {
            if (member.roles.cache.get(value) != null) {
                hasRole = true;
            }})
        return hasRole;
    }
}

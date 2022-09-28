import { GuildMember, PermissionFlagsBits } from "discord.js";

export function isModerator(member: GuildMember): boolean {
    return member.roles.cache.has(process.env.MOD_ROLE) ||
        member.permissions.has(PermissionFlagsBits.Administrator)
}
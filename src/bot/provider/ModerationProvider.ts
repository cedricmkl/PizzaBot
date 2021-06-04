import {GuildMember} from "discord.js";
import MutedUserModel, {MutedUser} from "../schema/MutedUserModel";

export default class ModerationProvider {

    static async muteMember(member: GuildMember, reason?: String, duration?: number): Promise<MutedUser> {
        const unmuteAt = duration ? Date.now() + duration : null
        return MutedUserModel.create({id: member.id, reason: reason, unmuteAt: unmuteAt})
    }

}
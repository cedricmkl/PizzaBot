import {GuildMember, Message, TextChannel} from "discord.js";

export default class UserInputUtil {

    static awaitInput(member: GuildMember, channel: TextChannel, time: number): Promise<Message> {
        return new Promise<Message>((resolve, reject) => {
            channel.awaitMessages(
                {
                    filter: args => args.guild && args.member.id == member.id && args.channel == channel,
                    time: time, max: 1
                })
                .then(value => {
                    resolve(value.first())
                }).catch(() => {
                reject()
            })

        })
    }
}
import TextCommand from "../command/TextCommand";
import {Message, MessageActionRow, MessageButton} from "discord.js";
import Embed from "../../utils/Embed";

export default class MessageTextCommand extends TextCommand {
    constructor() {
        super("message", true);
    }

    async execute(message: Message, params: string[]) {
        if (!message.member.permissions.has("ADMINISTRATOR")) return
        if (!params[0]) return

        switch (params[0]) {
            case "reactionRoles": {
                return message.channel.send({
                    embeds: [Embed.info(
                        "Roles",
                        "Hier kannst du dir Rollen zu verschiedenen Bereichen beim Programmieren geben." +
                        " Klicke dazu einfach auf den Button unter der Nachricht."
                    )],
                    components: [
                        new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setLabel("Rollen erhalten")
                                    .setCustomId("reactionRole:create")
                                    .setStyle("PRIMARY")
                            )
                    ]
                })
            }
        }
    }

}
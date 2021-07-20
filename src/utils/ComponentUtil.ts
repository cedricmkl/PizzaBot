import {Message, MessageActionRow, MessageButton} from "discord.js";

export default class ComponentUtil {

    static createAcceptRejectComponents(identifier: string): MessageActionRow {
        const actionRow = new MessageActionRow()
        actionRow.addComponents(
            new MessageButton()
                .setCustomId(`${identifier}:accept`)
                .setEmoji("✅")
                .setStyle("SUCCESS")
                .setLabel("Akzeptieren"),
            new MessageButton()
                .setCustomId(`${identifier}:reject`)
                .setEmoji("❌")
                .setStyle("DANGER")
                .setLabel("Ablehnen")
        )
        return actionRow
    }

    static async disableAllButtons(message: Message) {
        const components = []

        message.components.forEach(row => {
            row.components.forEach(value => value.setDisabled(true))
            components.push(row)
        })
        await message.edit({components: components})
    }


}
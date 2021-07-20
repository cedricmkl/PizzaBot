import ButtonListener from "../ButtonListener";
import {ButtonInteraction, GuildMember, MessageActionRow, MessageButton, Snowflake} from "discord.js";

export default class ReactionRolesListener extends ButtonListener {
    reactionRoles: Array<ReactionRole> = require("../../../../data/reactionRoles.json")

    constructor() {
        super("reactionRole");
    }

    async handleInteraction(interaction: ButtonInteraction, value: string) {
        const member = interaction.member as GuildMember
        if (value == "create") {
            interaction.reply({
                content: "Klicke auf die Buttons um dir Rollen zu geben oder entfernen",
                components: this.buildButtons(interaction.member as GuildMember),
                ephemeral: true
            })
        } else if (value.startsWith("add")) {
            const roleID = value.split("|")[1]
            await member.roles.add(roleID as Snowflake, "Roles")
            await interaction.update({
                components: this.buildButtons(interaction.member as GuildMember)
            })
        } else if (value.startsWith("remove")) {
            const roleID = value.split("|")[1]
            await member.roles.remove(roleID as Snowflake, "Roles")
            await interaction.update({
                components: this.buildButtons(interaction.member as GuildMember)
            })
        }
    }

    private buildButtons(member: GuildMember): Array<MessageActionRow> {
        const actionRows: Array<MessageActionRow> = [new MessageActionRow()]

        let row = 0
        this.reactionRoles.forEach(value => {
            if (actionRows[row].components.length >= 5) {
                actionRows.push(new MessageActionRow())
                row++
            }
            const actionRow = actionRows[row]

            if (member.roles.cache.has(value.role)) {
                actionRow.addComponents(
                    new MessageButton()
                        .setCustomId(`reactionRole:remove|${value.role.toString()}`)
                        .setStyle("DANGER")
                        .setEmoji(value.emoji)
                        .setLabel(value.name)
                )
            } else {
                actionRow.addComponents(
                    new MessageButton()
                        .setCustomId(`reactionRole:add|${value.role.toString()}`)
                        .setStyle("SUCCESS")
                        .setEmoji(value.emoji)
                        .setLabel(value.name)
                )
            }
        })

        return actionRows
    }
}

interface ReactionRole {
    emoji: string,
    role: Snowflake,
    name: string
}
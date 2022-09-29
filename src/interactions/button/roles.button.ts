import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, GuildMember, Snowflake } from "discord.js";


//roles_create
//roles_add:203928847847837
//roles_remove:23782874827433
const config: RoleConfig = require("../../../data/reactionRoles.json")
export async function rolesButtonSubmit(interaction: ButtonInteraction) {
    const customId = interaction.customId.split("_")[1]
    const member = interaction.member as GuildMember

    if (customId === "create") {
        await sendRoleList(interaction, member)
    } else if (customId.startsWith("add")) {
        await addRole(interaction, member, customId.split(":")[1])
    } else if (customId.startsWith("remove")) {
        await removeRole(interaction, member, customId.split(":")[1])
    }

}

async function sendRoleList(interaction: ButtonInteraction, member: GuildMember) {
    if (!member.roles.cache.has(config.partingLineRole)) await member.roles.add(config.partingLineRole)

    await interaction.reply({
        content: "Klicke auf die Buttons um dir Rollen zu geben oder entfernen",
        components: createButtons(member),
        ephemeral: true
    })
}

async function addRole(interaction: ButtonInteraction, member: GuildMember, roleId: Snowflake) {
    await member.roles.add(roleId)
    await interaction.update({
        components: createButtons(member)
    })
}

async function removeRole(interaction: ButtonInteraction, member: GuildMember, roleId: Snowflake) {
    await member.roles.remove(roleId)
    await interaction.update({
        components: createButtons(member)
    })
}


function createButtons(member: GuildMember): Array<ActionRowBuilder<ButtonBuilder>> {
    const actionRows: Array<ActionRowBuilder<ButtonBuilder>> = [new ActionRowBuilder()]
    let row = 0
    config.roles.forEach(value => {
        if (actionRows[row].components.length >= 5) {
            actionRows.push(new ActionRowBuilder())
            row++
        }
        const actionRow = actionRows[row]

        if (member.roles.cache.has(value.role)) {
            actionRow.addComponents(
                new ButtonBuilder()
                    .setCustomId(`roles_remove:${value.role.toString()}`)
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji(value.emoji)
                    .setLabel(value.name)
            )
        } else {
            actionRow.addComponents(
                new ButtonBuilder()
                    .setCustomId(`roles_add:${value.role.toString()}`)
                    .setStyle(ButtonStyle.Success)
                    .setEmoji(value.emoji)
                    .setLabel(value.name)
            )
        }
    })

    return actionRows
}


interface Role {
    emoji: string,
    role: Snowflake,
    name: string
}

interface RoleConfig {
    roles: Array<Role>,
    partingLineRole: Snowflake,
}
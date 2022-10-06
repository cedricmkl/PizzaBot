import {ChatInputCommandInteraction, Client, GuildMember, Role, Snowflake} from "discord.js";
import customColorModel from "../../database/model/custom-color.model";
import {isModerator} from "../../util/permissions";

const COLOR_REGEX = new RegExp(/^#?([0-9a-f]{6})$/i)

export async function colorCommand(interaction: ChatInputCommandInteraction) {
    const member = interaction.member as GuildMember
    const customColor = await customColorModel.findOne({userId: interaction.user.id as string})

    switch (interaction.options.getSubcommand()) {
        case "reset": {
            if (customColor == null) {
                return await interaction.reply({content: "Du besitzt keine Farbe!", ephemeral: true})
            }

            await customColor.delete()
            await interaction.guild.roles.delete(customColor.roleId as Snowflake)

            await interaction.reply({content: "Deine Farbe wurde gelöscht.", ephemeral: true})
            break
        }
        case "set": {
            const input = interaction.options.getString("color")

            let matches = COLOR_REGEX.exec(input)

            if (matches == null) {
                return await interaction.reply({content: "Bitte gebe eine HEX Farbe ein.", ephemeral: true})
            }

            const color = matches[1]

            let role = customColor == null ? null : await interaction.guild.roles.fetch(customColor.roleId)
            if (role == null) {
                role = await createRole(interaction, color)
                await member.roles.add(role)

                await customColorModel.updateOne({
                    userId: interaction.user.id
                }, {
                    userId: interaction.user.id,
                    roleId: role.id
                }, {
                    upsert: true
                })
            } else {
                role = await interaction.guild.roles.edit(
                    role,
                    {
                        color: `#${color}`,
                        name: interaction.user.username
                    }
                )
            }
            return await interaction.reply({
                content: `Deine Farbe wurde erfolgreich zu ${role.toString()} gesetzt.`,
                ephemeral: true
            })
        }
    }

}

async function createRole(interaction: ChatInputCommandInteraction, color: string): Promise<Role> {
    const modRolePositon: number = (await interaction.guild.roles.fetch(process.env.MOD_ROLE)).position
    return await interaction.guild.roles.create({
        color: `#${color}`,
        name: interaction.user.username,
        position: isModerator(interaction.member as GuildMember) ? modRolePositon + 1 : modRolePositon - 1
    })
}

export function registerNitroColorListener(client: Client) {
    client.on("guildMemberUpdate", async (oldMember, newMember) => {
        if (oldMember.premiumSince && !newMember.premiumSince) {
            const customColor = await customColorModel.findOne({userId: newMember.user.id as string})
            if (!customColor) return
            await customColor.delete()
            await newMember.guild.roles.delete(customColor.roleId as Snowflake)
        }
    })

    client.on("guildMemberRemove", async (member) => {
        const customColor = await customColorModel.findOne({userId: member.user.id as string})
        if (!customColor) return
        await customColor.delete()
        await member.guild.roles.delete(customColor.roleId as Snowflake)
    })
}

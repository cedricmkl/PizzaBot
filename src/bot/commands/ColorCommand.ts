import SlashCommand from "../command/SlashCommand";
import {Client, CommandInteraction, GuildMemberRoleManager, Snowflake} from "discord.js";
import Embed from "../../utils/Embed";
import CustomColorModel from "../schema/CustomColorModel";

export default class ColorCommand extends SlashCommand {
    private static COLOR_REGEX = new RegExp(/^#?([0-9a-f]{6})$/i)

    constructor() {
        super("color", "Ändere deine Rollenfarbe (nur für Booster)")
        this.builder
            .addSubcommand(
                command => command.setName("set").setDescription("Setze deine Rollenfarbe (nur für Booster)")
                    .addStringOption(option => option.setName("color").setDescription("Die Farbe in HEX").setRequired(true))
            )
            .addSubcommand(command => command.setName("reset").setDescription("Setze deine Rollenfarbe zurück (nur für Booster)"))
    }

    registerEvents(client: Client) {
        client.on("guildMemberUpdate", async (oldMember, newMember) => {
            if (oldMember.premiumSince && !newMember.premiumSince) {
                const customColor = await CustomColorModel.findOne({userId: newMember.user.id as string})
                if (!customColor) return
                await customColor.delete()
                await newMember.guild.roles.delete(customColor.roleId as Snowflake)
            }
        })
    }

    async execute(interaction: CommandInteraction) {
        const memberRoleManager = interaction.member.roles as GuildMemberRoleManager
        if (!(memberRoleManager.cache.has(process.env.MOD_ROLE) || (memberRoleManager.premiumSubscriberRole != null &&
            memberRoleManager.cache.has(memberRoleManager.premiumSubscriberRole.id)))) {
            await interaction.reply(
                {
                    embeds: [Embed.error("Keine Rechte", "Du darfst diesen Befehl nur als Booster oder Teammitglied nutzen.")],
                    ephemeral: true
                }
            )
        }

        await interaction.deferReply({ephemeral: true})

        const customColor = await CustomColorModel.findOne({userId: interaction.user.id as string})

        switch (interaction.options.getSubcommand()) {
            case "reset": {
                if (customColor == null) {
                    return await interaction.editReply({content: "Du besitzt keine Farbe!"})
                }

                await customColor.delete()
                await interaction.guild.roles.delete(customColor.roleId as Snowflake)

                await interaction.editReply({content: "Deine Farbe wurde gelöscht."})
                break
            }
            case "set": {
                const input = interaction.options.getString("color")

                let matches = ColorCommand.COLOR_REGEX.exec(input)

                if (matches == null) {
                    return await interaction.editReply("Bitte gebe eine HEX Farbe ein.")
                }

                const color = matches[1]

                let role = customColor == null ? null : await interaction.guild.roles.fetch(customColor.roleId)
                if (role == null) {
                    role = await interaction.guild.roles.create({
                        color: `#${color}`,
                        name: interaction.user.username,
                        position: interaction.guild.roles.botRoleFor(interaction.client.user).position
                    })
                    await memberRoleManager.add(role)

                    await CustomColorModel.updateOne({
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
                return await interaction.editReply(`Deine Farbe wurde erfolgreich zu ${role.toString()} gesetzt.`)
            }
        }

    }
}
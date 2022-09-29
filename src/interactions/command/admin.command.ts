import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction } from "discord.js";
import { createEmbed } from "../../util/embeds";

export async function adminCommand(interaction: ChatInputCommandInteraction) {
    switch (interaction.options.getString("action")) {
        case "create_roles":
            await createRoles(interaction)
            break
    }
}

async function createRoles(interaction: ChatInputCommandInteraction) {
    await interaction.channel.send({
        embeds: [createEmbed(
            "Rollen",
            "Hier kannst du dir Rollen zu verschiedenen Bereichen beim Programmieren geben." +
            " Klicke dazu einfach auf den Knopf unter der Nachricht."
        )],
        components: [
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel("Rollen erhalten")
                        .setCustomId("roles_create")
                        .setStyle(ButtonStyle.Primary)
                )
        ]
    })
    await interaction.reply({ content: "sent", ephemeral: true })
}

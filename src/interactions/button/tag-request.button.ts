import { ButtonInteraction, Colors, GuildMember } from "discord.js"
import { createOrEditTagfromTagRequest, getTagRequest } from "../../database/database"
import { createEmbed } from "../../util/embeds"
import { isModerator } from "../../util/permissions"

export async function tagsRequestButtonSubmit(interaction: ButtonInteraction) {
    if (!isModerator(interaction.member as GuildMember)) return
    const request = await getTagRequest(interaction.message.id)
    if (!request) return

    if (interaction.customId === "tagrequest_accept") {
        await createOrEditTagfromTagRequest(request)
        await interaction.message.edit({
            embeds: [
                createEmbed("Tag Anfrage angenommen", `${interaction.user.toString()} hat die Anfrage angenommen.`, [], Colors.Green)
            ],
            components: []
        })
        await interaction.reply({ content: "Angenommen.", ephemeral: true })
    } else {
        await request.delete()
        await interaction.message.edit({
            embeds: [
                createEmbed("Tag Anfrage abgelehnt", `${interaction.user.toString()} hat die Anfrage abgelehnt.`, [], Colors.Red)
            ],
            components: []
        })
        await interaction.reply({ content: "Abgelehnt.", ephemeral: true })
    }
}
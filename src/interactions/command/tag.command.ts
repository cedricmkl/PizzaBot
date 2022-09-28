import { ChatInputCommandInteraction } from "discord.js";
import { getTag } from "../../database/database";
import { errorEmbed } from "../../util/embeds";
import { formatTagName } from "../../util/names";

export async function tagCommand(interaction: ChatInputCommandInteraction) {
    const name = formatTagName(interaction.options.getString("name").toLowerCase())
    const tag = await getTag(name)
    if (!tag) return await interaction.reply({ embeds: [errorEmbed("Der Tag wurde nicht gefunden.")] })
    await interaction.reply(tag.content)
}
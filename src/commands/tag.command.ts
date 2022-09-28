import { AutocompleteInteraction, ChatInputCommandInteraction } from "discord.js";
import { getCachedTags, getTag } from "../database/database";
import { errorEmbed } from "../util/embeds";

export async function tagCommand(interaction: ChatInputCommandInteraction) {
    const name = interaction.options.getString("name")
    const tag = await getTag(name)
    if (!tag) return await interaction.reply({ embeds: [errorEmbed("Der Tag wurde nicht gefunden.")] })
    await interaction.reply(tag.content)
}

export async function tagAutocomplete(interaction: AutocompleteInteraction) {
    const input = interaction.options.getString("name")

    const tags = await getCachedTags()
    const filteredTags = tags.filter(tag => tag.name.includes(input) ||
        tag.aliases.some(alias => alias.includes(input)))
        .slice(0, 10)
        .map(tag => {
            return {
                name: tag.name,
                value: tag.name,
            }
        })
    await interaction.respond(filteredTags)
}
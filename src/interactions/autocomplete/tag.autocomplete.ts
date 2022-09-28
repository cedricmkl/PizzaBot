import { AutocompleteInteraction } from "discord.js"
import { getCachedTags } from "../../database/database"

export async function tagAutocomplete(interaction: AutocompleteInteraction) {
    const input = interaction.options.getString("name").toLowerCase()
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
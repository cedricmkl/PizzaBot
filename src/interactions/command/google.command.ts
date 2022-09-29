import { ChatInputCommandInteraction } from "discord.js";
import * as GoogleSearch from "google-search";
import { createEmbed, errorEmbed } from "../../util/embeds";

const search = new GoogleSearch({
    key: process.env.GOOGLE_KEY,
    cx: process.env.GOOGLE_CSE_CX
});

export async function googleCommand(interaction: ChatInputCommandInteraction) {
    const query = interaction.options.getString("query")

    search.build({
        q: query
    }, async (error, response) => {
        if (error) throw error
        const items = response.items

        if (!items || items < 1) {
            return await interaction.reply({
                embeds: [errorEmbed(
                    "Keine Ergebnisse",
                    "Ich konnte keine Ergebnisse finden."
                )]
            })
        }

        let description = ""
        let i = 1
        response.items.forEach(element => {
            description += `${i}. [${element.title}](${element.link})\n`
            i++;
        });

        await interaction.reply({
            embeds: [createEmbed(
                `Ergebnisse`,
                description
            )]
        })
    })
}
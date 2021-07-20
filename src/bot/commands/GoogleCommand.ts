import SlashCommand from "../command/SlashCommand";
import {CommandInteraction} from "discord.js";
import SlashCommandArgument from "../command/SlashCommandArgument";
import Embed from "../../utils/Embed";
import GoogleSearch = require('google-search');

export default class GoogleCommand extends SlashCommand {
    private readonly searchEngine: GoogleSearch

    constructor() {
        super("google", "Suche im Internet nach einem Search-Term");
        this.withArgument(new SlashCommandArgument(
            "STRING",
            "term"
        ))
        this.searchEngine = new GoogleSearch({
            key: process.env.GOOGLE_KEY,
            cx: process.env.GOOGLE_CSE_CX
        });
    }


    async execute(interaction: CommandInteraction) {
        await interaction.defer()
        const term = interaction.options.getString("term")

        this.searchEngine.build({
            q: term
        }, async (error, response) => {
            if (error) throw error
            const items = response.items

            if (!items || items < 1) {
                return interaction.editReply({
                    embeds: [Embed.error(
                        "Keine Ergebnisse",
                        "Ich konnte keine Ergebnisse finden!"
                    )]
                })
            }

            let description = ""
            let i = 1
            response.items.forEach(element => {
                description += `${i}. [${element.title}](${element.link})\n`
                i++;
            });

            interaction.editReply({
                embeds: [Embed.info(
                    `Ergebnisse`,
                    description
                )]
            })
        })
    }

}
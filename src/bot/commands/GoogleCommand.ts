import SlashCommand from "../command/SlashCommand";
import {CommandInteraction} from "discord.js";
import Embed from "../../utils/Embed";
import GoogleSearch = require('google-search');

export default class GoogleCommand extends SlashCommand {
    private readonly searchEngine: GoogleSearch

    constructor() {
        super("google", "Suche im Internet nach einem Search-Term");
        this.builder.addStringOption(stringOption =>
            stringOption.setName("query")
                .setDescription("Der Search Term"))

        this.searchEngine = new GoogleSearch({
            key: process.env.GOOGLE_KEY,
            cx: process.env.GOOGLE_CSE_CX
        });
    }


    async execute(interaction: CommandInteraction) {
        await interaction.deferReply()
        const query = interaction.options.getString("query")

        this.searchEngine.build({
            q: query
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
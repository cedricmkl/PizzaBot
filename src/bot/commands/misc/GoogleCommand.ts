import Command from "../Command";
import {CommandParameterType} from "../CommandParameterType";
import {Client, CommandInteraction, MessageEmbed} from "discord.js";
import PasteUtil from "../../../utils/PasteUtil";
import GoogleSearch = require('google-search');


export default class GoogleCommand extends Command {
    searchEngine: any

    constructor() {
        super("google", "Suche im Internet nach einer Frage");
        this.withParameter({
            name: "term",
            type: CommandParameterType.STRING,
            description: "Dein Search-Term",
            required: true
        })

        this.searchEngine = new GoogleSearch({
            key: process.env.GOOGLE_KEY,
            cx: process.env.GOOGLE_CSE_CX
        });

    }

    async executeSlash(client: Client, interaction: CommandInteraction) {
        await interaction.defer()

        const term: string = interaction.options[0].value as string

        this.searchEngine.build({
            q: term
        }, async (error, response) => {
            if (error) {
                const paste = await PasteUtil.paste(error)
                return interaction.editReply(new MessageEmbed({
                    title: "Fehler beim ausführen dieses Comands",
                    description: `Ich habe den Fehler hier hochgeladen: ${paste}`,
                    color: "RED"
                }))

            }
            const items = response.items

            if (!items || items.size < 1) {
                return interaction.editReply(new MessageEmbed({
                    title: "Keine Ergebnisse",
                    description: "Ich konnte keine Ergebnisse finden!",
                    color: "RED"
                }))
            }

            let description = ""
            let i = 1
            response.items.forEach(element => {
                description += `${i}. [${element.title}](${element.link})\n`
                i++;
            });

            await interaction.editReply(new MessageEmbed({
                title: `Suche nach ${term}`,
                description: description,
                color: "GREEN"
            }))
        })
    }

}

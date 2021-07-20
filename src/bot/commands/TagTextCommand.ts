import TextCommand from "../command/TextCommand";
import {Message, MessageEmbed} from "discord.js";
import TagProvider from "../provider/TagProvider";

export default class TagTextCommand extends TextCommand {
    constructor() {
        super("tag");
    }

    async execute(message: Message, params: string[]) {
        if (!params[0]) return message.reply({content: "Nutze `tag <name>`"})

        if (params[0] == "domme") {
            return message.channel.send({
                embeds: [new MessageEmbed({
                    title: "Domme",
                    description: "Der is schon cool oder",
                    color: "#FFFF00",
                    timestamp: Date.now(),
                    fields: [{
                        name: 'Versuch mal den Tag zu löschen pepeLaugh',
                        value: 'GEHT NICHT ROFL LUL HAHAHAHA funny ik'
                    }],
                    footer: {text: "Gebt. Domme. Geld."}
                })
                ]
            })
        }

        const tag = await TagProvider.getTag(params[0])

        message.channel.send(tag ? tag.content : "Der Tag wurde nicht gefunden")
    }

}
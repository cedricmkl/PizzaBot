import Command from "../Command";
import {Client, GuildMember, Message, MessageEmbed} from "discord.js";
import {CommandParameterType} from "../CommandParameterType";
import TagProvider from "../../provider/TagProvider";

export default class TagCommand extends Command {

    constructor() {
        super("tag", "Einen Tag in den Channel senden", true);
        this.withParameter({
            name: "name",
            description: "Name des Tags",
            type: CommandParameterType.STRING,
            required: true
        })
    }

    async executeSlash(client, command) {
        await command.defer()
        const name: string = command.options.find(value => value.name === "name").value

        const result = await this.getTag(name)
        await command.editReply(result)
    }

    async executeText(client: Client, args: string[], member: GuildMember, message: Message) {
        if (args.length < 1) return message.channel.send("Nutze `tag <name>`")
        const name = args[0];

        const result = await this.getTag(name)
        await message.channel.send(result);
    }

    async getTag(name: string): Promise<string | MessageEmbed> {
        switch (name.toLowerCase()) {
            case "domme": {
                return new MessageEmbed({
                    title: "Domme",
                    description: "Der is schon cool oder",
                    color: "#FFFF00",
                    timestamp: Date.now(),
                    fields: [{
                        name: 'Versuch mal den Tag zu löschen pepeLaugh',
                        value: 'GEHT NICHT ROFL LUL HAHAHAHA funny ik'
                    }
                    ],
                    footer: {text: "Gebt. Domme. Geld."}
                })
            }
            default: {
                const tag = await TagProvider.getTag(name);
                if (!tag) return "Der Tag existiert nicht"
                return tag.content
            }
        }
    }

}

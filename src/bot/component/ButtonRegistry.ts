import {Client} from "discord.js";
import ButtonListener from "./ButtonListener";
import TagRequestListener from "./components/TagRequestListener";
import ReactionRolesListener from "./components/ReactionRolesListener";

export default class ButtonRegistry {
    client: Client
    listeners: Array<ButtonListener> = []

    constructor(client: Client) {
        this.client = client
        this.register()

        this.client.on("interactionCreate", (interaction) => {
            if (!interaction.isButton()) return
            if (interaction.guild.id != process.env.GUILD) return;
            const args = interaction.customId.split(":");
            if (args.length != 2) return;
            this.listeners.filter(value => value.identifier.includes(args[0])).forEach(value => value.handleInteraction(interaction, args[1]))
        })

    }

    register() {
        this.listeners.push(new TagRequestListener())
        this.listeners.push(new ReactionRolesListener())

    }

}
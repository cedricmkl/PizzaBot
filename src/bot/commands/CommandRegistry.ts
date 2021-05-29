import {Client} from "discord.js";
import Command from "./Command";
import CommandMessageHandler from "./CommandMessageHandler";

export default class CommandRegistry {
    private readonly client: Client
    private readonly commands: Command[]
    constructor(client: Client) {
        this.client = client;
        this.commands = []
        this.initListener();
    }

    private initListener() {
        this.client.on("interaction", (interaction) => {
            if (!interaction.isCommand()) return
            if (interaction.guild.id != process.env.GUILD) return;
            const command: Command = this.commands.find(value => value.name === interaction.commandName)
            if (command === null) return;
            if(!command.canExecute(interaction.member)) return interaction.reply("Du hast keine Rechte diesen Command auszuführen", {ephemeral: true});

            command.executeSlash(this.client, interaction)
        })

        this.client.on("message", (message) => {
            if (!message.guild) return;
            if (message.author.bot) return;
            this.commands.forEach(value => {
                if (value instanceof CommandMessageHandler) {
                    value.handleMessage(message)
                }
            })

            const args : string[] = message.content.split(" ");
            const name = args[0];
            const command : Command = this.commands.find(value => value.checkTextCommand(name.toLowerCase()));
            if (!command) return;
            if (!command.canExecute(message.member)) {
                message.reply("Du kannst diesen Command nicht ausführen!")
                return;
            }

            args.shift()
            command.executeText(this.client, args, message.member, message)
        })
    }

    async registerCommand(command: Command) {
        this.commands.push(command)
        await command.registerSlashCommand(this.client)
    }
}
import {Client, MessageEmbed} from "discord.js";
import Command from "./Command";
import CommandMessageHandler from "./CommandMessageHandler";
import PasteUtil from "../../utils/PasteUtil";

export default class CommandRegistry {
    readonly commands: Command[]
    private readonly client: Client

    constructor(client: Client) {
        this.client = client;
        this.commands = []
        this.initListener();
    }

    async registerCommand(command: Command) {
        this.commands.push(command)
        if (process.env.UPDATE_COMMANDS == "true") {
            await command.registerSlashCommand(this.client)
        }
    }

    private initListener() {
        this.client.on("interaction", (interaction) => {
            if (!interaction.isCommand()) return
            if (interaction.guild.id != process.env.GUILD) return;
            const command: Command = this.commands.find(value => value.name === interaction.commandName)
            if (!command) return;
            if (!command.canExecute(interaction.member)) return interaction.reply("Du hast keine Rechte diesen Command auszuführen", {ephemeral: true});

            command.executeSlash(this.client, interaction).catch(async reason => {
                const paste = await PasteUtil.paste(reason)
                const embed = new MessageEmbed({
                    title: "Fehler beim ausführen des Commands",
                    description: `Fehler wurde hier hochgeladen: ${paste}`,
                    color: "RED"
                })
                await interaction.editReply(embed).catch(reason1 => console.log(reason1))
            })
        })

        this.client.on("message", (message) => {
            if (!message.guild) return;
            if (message.author.bot) return;
            this.commands.forEach(value => {
                if (value instanceof CommandMessageHandler) {
                    value.handleMessage(message)
                }
            })

            const args: string[] = message.content.split(" ");
            const name = args[0];
            const command: Command = this.commands.find(value => value.checkTextCommand(name.toLowerCase()));
            if (!command) return;
            if (!command.canExecute(message.member)) {
                message.reply("Du kannst diesen Command nicht ausführen!")
                return;
            }

            args.shift()
            command.executeText(this.client, args, message.member, message).catch(async reason => {
                const paste = await PasteUtil.paste(reason)
                await message.channel.send(new MessageEmbed({
                    title: "Fehler beim ausführen des Commands",
                    description: `Fehler wurde hier hochgeladen: ${paste}`,
                    color: "RED"
                }))
            })
        })
    }
}
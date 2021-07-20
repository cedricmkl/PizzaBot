import {Client, MessageEmbed} from "discord.js";
import SlashCommand from "./SlashCommand";
import PasteUtil from "../../utils/PasteUtil";
import TextCommand from "./TextCommand";

export default class CommandRegistry {
    readonly slashCommands: SlashCommand[] = []
    readonly textCommands: TextCommand[] = []

    private readonly client: Client

    constructor(client: Client) {
        this.client = client;
        this.initListener();
    }

    async registerSlashCommand(command: SlashCommand) {
        this.slashCommands.push(command)
        if (process.env.UPDATE_COMMANDS == "true") {
            await command.register(this.client)
        }
    }

    async registerTextCommand(command: TextCommand) {
        this.textCommands.push(command)
    }

    private initListener() {
        this.client.on("interactionCreate", (interaction) => {
            if (!interaction.isCommand()) return
            if (interaction.guild.id != process.env.GUILD) return;
            const command: SlashCommand = this.slashCommands.find(value => value.name === interaction.commandName)
            if (!command) return;
            if (!command.canExecute(interaction)) return interaction.reply({
                content: "Du hast keine Rechte diesen Command auszuführen",
                ephemeral: true
            });
            command.execute(interaction)
                .catch(async reason => {
                    const paste = await PasteUtil.paste(reason)
                    const embed = new MessageEmbed({
                        title: "Fehler beim ausführen des Commands",
                        description: `Fehler wurde hier hochgeladen: ${paste}`,
                        color: "RED"
                    })
                    await interaction.fetchReply()
                    if (interaction.replied || interaction.deferred) {
                        await interaction.editReply({embeds: [embed]})
                    } else {
                        await interaction.reply({embeds: [embed]})
                    }
                })
        })

        this.client.on("messageCreate", (message) => {
            if (!message.guild) return;
            if (message.guild.id != process.env.GUILD) return;
            if (message.author.bot) return;
            const args: string[] = message.content.split(" ");
            const name = args[0].replace(process.env.PREFIX, "");
            const containsPrefix = args[0].startsWith(process.env.PREFIX)
            const command: TextCommand = this.textCommands
                .find(value => value.name.toLowerCase() == name.toLowerCase());
            if (!command) return;
            if (command.prefixNeeded && !containsPrefix) return;


            args.shift()
            command.execute(message, args).catch(async reason => {
                const paste = await PasteUtil.paste(reason)
                await message.channel.send({
                    embeds: [new MessageEmbed({
                        title: "Fehler beim ausführen des Commands",
                        description: `Fehler wurde hier hochgeladen: ${paste}`,
                        color: "RED"
                    })]
                })
            })
        })
    }
}
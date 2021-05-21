import {Client, GuildMember} from "discord.js";
import Command from "./Command";
import CommandArguments from "./CommandArguments";
import CommandActionExecutor from "./CommandActionExecutor";

export default class CommandRegistry {
    private readonly client: Client
    private readonly commands: Command[]
    constructor(client: Client) {
        this.client = client;
        this.commands = []
        this.initListener();
    }

    private initListener() {
        //@ts-ignore
        this.client.ws.on("INTERACTION_CREATE", async (interaction) => {
            if (interaction.type !== 2) return;
            if (interaction.guild_id !== process.env.GUILD) return;

            const commandName : string = interaction.data.name;
            const command : Command = this.commands.find(value => value.name === commandName);

            if (command === null) return;

            const guild = await this.client.guilds.fetch(interaction.guild_id)
            const member: GuildMember = await guild.members.fetch(interaction.member.user.id);

            const options = interaction.data.options;
            const commandArguments : CommandArguments = new CommandArguments();

            commandArguments.parseData(options, command.params);

            if(!command.canExecute(member)) return;

            command.executeSlash(this.client, member, commandArguments, new CommandActionExecutor(this.client, interaction.token, interaction.id,))
        })

        this.client.on("message", (message) => {
            if (!message.guild) return;
            if (message.author.bot) return;
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
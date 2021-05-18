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
        this.client.ws.on("INTERACTION_CREATE", (interaction) => {
            if (interaction.type !== 2) return;
            if (interaction.guild_id !== process.env.GUILD) return;

            const commandName : string = interaction.data.name;
            const command : Command = this.commands.find(value => value.name === commandName);

            if (command === null) return;

            const member: GuildMember = interaction.member;
            const options = interaction.data.options;
            const commandArguments : CommandArguments = new CommandArguments();

            commandArguments.parseData(options, command.params);

            command.execute(this.client, member, commandArguments, new CommandActionExecutor(this.client, interaction.token, interaction.id,))
        })

        this.client.on("message", (message) => {
            if (!message.guild) return;
            const args : string[] = message.content.split(" ");
            const command : Command = this.commands.find(value => value.name === args[0]);
            if (!command) return;
            args.shift()
            command.executeTextCommand(this.client, args, message.member, message)
        })
    }

    registerCommand(command: Command) {
        this.commands.push(command)
        command.registerCommand(this.client)
    }
}
import {Client, GuildMember} from "discord.js";
import Command from "./Command";
import {unwatchFile} from "fs";
import CommandArguments from "./CommandArguments";

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

            command.execute(this.client, member, commandArguments)
        })
    }

    registerCommand(command: Command) {
        this.commands.push(command)
        command.registerCommand(this.client)
    }
}
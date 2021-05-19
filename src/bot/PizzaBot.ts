import { Client } from "discord.js"
import DatabaseHelper from "../utils/DatabaseHelper";
import TagCommand from "./commands/tag/TagCommand";
import CommandRegistry from "./command/CommandRegistry";

export default class PizzaBot {
    private readonly client: Client
    private commandRegistry: CommandRegistry

    constructor() {
        DatabaseHelper.connect();
        this.client = new Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER'] });
        this.initListeners()
    }

    connect() {
        this.client.login(process.env.DISCORD_TOKEN);
    }

    initListeners() {
        this.client.on("ready", () => {
            console.log(`Successfully logged in as Discord Bot ${this.client.user.tag}`)
            this.initCommands();
        })
    }

    initCommands() {
        this.commandRegistry = new CommandRegistry(this.client)

        this.commandRegistry.registerCommand(new TagCommand())
    }
}
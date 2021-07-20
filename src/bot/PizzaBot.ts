import {Client} from "discord.js"
import DatabaseHelper from "../utils/DatabaseHelper";
import CommandRegistry from "./command/CommandRegistry";
import ButtonRegistry from "./component/ButtonRegistry";
import TagCommand from "./commands/TagCommand";
import TagsCommand from "./commands/TagsCommand";
import TagTextCommand from "./commands/TagTextCommand";
import TagsTextCommand from "./commands/TagsTextCommand";
import GoogleCommand from "./commands/GoogleCommand";
import SourceCommand from "./commands/SourceCommand";
import MessageTextCommand from "./commands/MessageTextCommand";

export default class PizzaBot {
    private readonly client: Client

    constructor() {
        DatabaseHelper.connect();
        this.client = new Client({intents: ["GUILD_MESSAGES", "GUILDS", "GUILD_MEMBERS"]});
        this.initListeners()
    }

    connect() {
        this.client.login(process.env.DISCORD_TOKEN);
    }

    initListeners() {
        this.client.on("ready", () => {
            console.log(`Successfully logged in as Discord Bot ${this.client.user.tag}`)
            this.init();
        })
    }

    async init() {
        //Reaction Roles
        //new ProgrammingReactionRoles(this.client)

        //Components
        new ButtonRegistry(this.client)


        //Commands
        const commandRegistry = new CommandRegistry(this.client)
        await commandRegistry.registerSlashCommand(new TagCommand())
        await commandRegistry.registerSlashCommand(new TagsCommand())
        await commandRegistry.registerSlashCommand(new GoogleCommand())
        await commandRegistry.registerSlashCommand(new SourceCommand())


        await commandRegistry.registerTextCommand(new TagTextCommand())
        await commandRegistry.registerTextCommand(new TagsTextCommand())
        await commandRegistry.registerTextCommand(new MessageTextCommand())


    }
}
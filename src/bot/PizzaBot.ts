import {Client} from "discord.js"
import DatabaseHelper from "../utils/DatabaseHelper";
import TagCommand from "./commands/tag/TagCommand";
import CommandRegistry from "./command/CommandRegistry";
import SourceCommand from "./commands/SourceCommand";
import CreateTagCommand from "./commands/tag/CreateTagCommand";
import EditTagCommand from "./commands/tag/EditTagCommand";
import ListTagsCommand from "./commands/tag/ListTagsCommand";
import DeleteTagCommand from "./commands/tag/DeleteTagCommand";
import TagInfoCommand from "./commands/tag/TagInfoCommand";
import CreateTagAliasCommand from "./commands/tag/CreateTagAliasCommand";
import RemoveTagAliasCommand from "./commands/tag/RemoveTagAliasCommand";

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

        this.commandRegistry.registerCommand(new SourceCommand())

        this.commandRegistry.registerCommand(new TagCommand())
        this.commandRegistry.registerCommand(new CreateTagCommand())
        this.commandRegistry.registerCommand(new EditTagCommand())
        this.commandRegistry.registerCommand(new ListTagsCommand())
        this.commandRegistry.registerCommand(new DeleteTagCommand())
        this.commandRegistry.registerCommand(new TagInfoCommand())
        this.commandRegistry.registerCommand(new CreateTagAliasCommand())
        this.commandRegistry.registerCommand(new RemoveTagAliasCommand())
    }
}
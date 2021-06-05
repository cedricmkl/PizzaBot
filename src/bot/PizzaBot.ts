import {Client} from "discord.js"
import DatabaseHelper from "../utils/DatabaseHelper";
import TagCommand from "./commands/tag/TagCommand";
import CommandRegistry from "./commands/CommandRegistry";
import SourceCommand from "./commands/misc/SourceCommand";
import CreateTagCommand from "./commands/tag/CreateTagCommand";
import EditTagCommand from "./commands/tag/EditTagCommand";
import TagsCommand from "./commands/tag/TagsCommand";
import DeleteTagCommand from "./commands/tag/DeleteTagCommand";
import TagInfoCommand from "./commands/tag/TagInfoCommand";
import CreateTagAliasCommand from "./commands/tag/CreateTagAliasCommand";
import RemoveTagAliasCommand from "./commands/tag/RemoveTagAliasCommand";
import ComponentRegistry from "./component/ComponentRegistry";
import GoogleCommand from "./commands/misc/GoogleCommand";
import ProgrammingReactionRoles from "./reactionroles/ProgrammingReactionRoles";

export default class PizzaBot {
    private readonly client: Client
    private commandRegistry: CommandRegistry
    private componentRegistry: ComponentRegistry

    constructor() {
        DatabaseHelper.connect();
        this.client = new Client({intents: ["GUILD_MESSAGES", "GUILDS", "GUILD_INTEGRATIONS", "DIRECT_MESSAGES", "GUILD_MESSAGE_REACTIONS", "GUILD_MEMBERS"]});
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
        new ProgrammingReactionRoles(this.client)

        //Components
        this.componentRegistry = new ComponentRegistry(this.client)

        //Commands
        this.commandRegistry = new CommandRegistry(this.client)
        await this.commandRegistry.registerCommand(new SourceCommand())
        await this.commandRegistry.registerCommand(new TagCommand())
        await this.commandRegistry.registerCommand(new CreateTagCommand())
        await this.commandRegistry.registerCommand(new EditTagCommand())
        await this.commandRegistry.registerCommand(new TagsCommand())
        await this.commandRegistry.registerCommand(new DeleteTagCommand())
        await this.commandRegistry.registerCommand(new TagInfoCommand())
        await this.commandRegistry.registerCommand(new CreateTagAliasCommand())
        await this.commandRegistry.registerCommand(new RemoveTagAliasCommand())
        await this.commandRegistry.registerCommand(new GoogleCommand())
    }
}
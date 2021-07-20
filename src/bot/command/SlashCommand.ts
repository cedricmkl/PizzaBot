import {
    ApplicationCommandOptionData,
    ApplicationCommandPermissionData,
    Client,
    CommandInteraction,
    CommandInteractionOptionResolver,
    Guild,
    GuildMember,
    Snowflake
} from "discord.js";
import PermissionsUtil from "../../utils/PermissionsUtil";
import SlashCommandArgument from "./SlashCommandArgument";

export default abstract class SlashCommand {
    readonly name: string;
    readonly description: string;
    arguments: ApplicationCommandOptionData[] | SlashCommandArgument[];
    roles: string[];


    protected constructor(name: string, description: string) {
        this.arguments = [];
        this.name = name;
        this.description = description;
        this.roles = [];
    }

    static hasSubCommand(options: CommandInteractionOptionResolver): boolean {
        try {
            options.getSubCommand()
            return true
        } catch {
            return false
        }
    }

    static hasSubCommandGroup(options: CommandInteractionOptionResolver): boolean {
        try {
            options.getSubCommandGroup()
            return true
        } catch {
            return false
        }
    }

    static getSubCommandGroupOrSubCommand(options: CommandInteractionOptionResolver): string | null {
        return this.hasSubCommandGroup(options) ? options.getSubCommandGroup()
            : (this.hasSubCommand(options) ? options.getSubCommand() : null)
    }

    withPermittedRoles(roles: string[]) {
        this.roles = roles;
    }

    withArgument(argument: SlashCommandArgument | ApplicationCommandOptionData) {
        this.arguments = [...this.arguments, argument]
    }

    withArguments(args: Array<SlashCommandArgument | ApplicationCommandOptionData>) {
        this.arguments = [...this.arguments, ...args]
    }

    async register(client: Client) {
        const params: ApplicationCommandOptionData[] = []

        this.arguments.forEach(value => {
            if (value instanceof SlashCommandArgument) {
                params.push(value.build())
            } else {
                params.push(value)
            }
        })
        console.log(params)

        const guild: Guild = await client.guilds.cache.get(process.env.GUILD as Snowflake)
        console.log({
            name: this.name,
            description: this.description,
            defaultPermission: this.roles.length == 0,
            options: params
        })
        const command = await guild.commands.create({
            name: this.name,
            description: this.description,
            defaultPermission: this.roles.length == 0,
            options: params
        })

        if (!command) return
        if (this.roles.length == 0) return
        const mappedPermissions: ApplicationCommandPermissionData[] = []

        this.roles.forEach(value => {
            mappedPermissions.push({
                id: value as Snowflake,
                type: "ROLE",
                permission: true
            })
        })

        await command.permissions.set({
            permissions: mappedPermissions
        })
    }

    abstract execute(interaction: CommandInteraction)

    canExecute(interaction: CommandInteraction): boolean {
        if (!PermissionsUtil.canExecute(this.roles, interaction.member as GuildMember)) return false
        let hasPermission = true

        if (SlashCommand.hasSubCommandGroup(interaction.options)) {
            const subCommand: SlashCommandArgument = this.arguments
                .filter(value1 => value1 instanceof SlashCommandArgument)
                .find(value2 => (value2 as SlashCommandArgument).name == interaction.options.getSubCommandGroup()) as SlashCommandArgument
            if (subCommand && !subCommand.hasPermission(interaction.member as GuildMember)) {
                hasPermission = false
            }
        }

        if (SlashCommand.hasSubCommand(interaction.options)) {
            const subCommand: SlashCommandArgument = this.arguments
                .filter(value1 => value1 instanceof SlashCommandArgument)
                .find(value2 => (value2 as SlashCommandArgument).name == interaction.options.getSubCommand()) as SlashCommandArgument
            if (subCommand && !subCommand.hasPermission(interaction.member as GuildMember)) {
                hasPermission = false
            }
        }

        return hasPermission
    }


}
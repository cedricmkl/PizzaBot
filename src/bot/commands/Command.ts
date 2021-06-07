import {
    ApplicationCommandOptionData,
    ApplicationCommandPermissionData,
    Client,
    CommandInteraction,
    Guild,
    GuildMember,
    Message
} from "discord.js";
import PermissionsUtil from "../../utils/PermissionsUtil";

export default abstract class Command {
    readonly name: string;
    readonly description: string;
    aliases: string[];
    executeWithOutPrefix: boolean;
    params: ApplicationCommandOptionData[];
    roles: string[];


    protected constructor(name: string, description: string, executeWithOutPrefix: boolean = false) {
        this.params = [];
        this.name = name;
        this.description = description;
        this.executeWithOutPrefix = executeWithOutPrefix;
        this.aliases = [];
        this.roles = [];
    }

    withAliases(aliases: string[]) {
        this.aliases = aliases;
    }

    withRoles(roles: string[]) {
        this.roles = roles;
    }

    withParameter(parameter: ApplicationCommandOptionData) {
        this.params = [...this.params, parameter]
    }

    async registerSlashCommand(client: Client) {
        const guild: Guild = await client.guilds.cache.get(process.env.GUILD)

        const command = await guild.commands.create({
            name: this.name,
            description: this.description,
            defaultPermission: this.roles.length == 0,
            options: this.params
        })

        const permissions: Array<ApplicationCommandPermissionData> = []
        this.roles.forEach(value => permissions.push({id: value, permission: true, type: 1}))

        if (permissions.length != 0) await command.setPermissions(permissions)
    }

    async executeSlash(client: Client, interaction: CommandInteraction): Promise<any | void> {
        interaction.reply("Der Command ist nicht als Slash-Command implementiert")
    }

    async executeText(client: Client, input: string[], member: GuildMember, message: Message): Promise<any | void> {
        message.reply("Der Command ist nicht als Text-Command implementiert")
    }

    checkTextCommand(input: String): boolean {
        if (input.charAt(0) !== process.env.PREFIX && !this.executeWithOutPrefix) return false;
        const name = input.replace(process.env.PREFIX, "")
        return this.name === name || this.aliases.includes(name)
    }

    canExecute(member: GuildMember): boolean {
        if (this.roles.length === 0) return true;
        return PermissionsUtil.canExecute(this.roles, member);
    }
}
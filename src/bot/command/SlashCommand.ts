import {
    ApplicationCommand,
    ApplicationCommandData,
    ApplicationCommandPermissionData,
    CommandInteraction,
    GuildMember,
    Snowflake
} from "discord.js";
import PermissionsUtil from "../../utils/PermissionsUtil";
import {SlashCommandBuilder} from "@discordjs/builders";

export default abstract class SlashCommand {
    readonly name: string;
    readonly permittedRoles: Snowflake[] = []
    private data: SlashCommandBuilder;

    protected constructor(data: SlashCommandBuilder) {
        this.data = data;
        this.name = data.name
    }

    build(): ApplicationCommandData {
        // @ts-ignore
        return {
            ...this.data.toJSON(),
            defaultPermission: this.permittedRoles.length == 0
        }
    }


    async registerPermissions(command: ApplicationCommand) {

        const mappedPermissions: ApplicationCommandPermissionData[] = []

        this.permittedRoles.forEach(value => {
            mappedPermissions.push({
                id: value,
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
        return PermissionsUtil.canExecute(this.permittedRoles, interaction.member as GuildMember)
    }


}
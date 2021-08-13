import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {
    ApplicationCommandOptionChoice,
    ApplicationCommandOptionData,
    ApplicationCommandOptionType,
    GuildMember,
    Snowflake
} from "discord.js";

export default class SlashCommandArgument {

    constructor(public readonly type: ApplicationCommandOptionType | ApplicationCommandOptionTypes,
                public readonly name: string,
                public readonly description: string = "Keine Beschreibung",
                public readonly required?: boolean,
                public readonly roles?: Snowflake[],
                public readonly choices?: ApplicationCommandOptionChoice[],
                public readonly options?: SlashCommandArgument[]
    ) {
    }

    build(): ApplicationCommandOptionData {
        return {
            type: this.type,
            name: this.name,
            description: this.description,
            required: this.type == "SUB_COMMAND" || this.type == "SUB_COMMAND_GROUP" ? null : this.required == null ? true : this.required,
            choices: this.type == "SUB_COMMAND" || this.type == "SUB_COMMAND_GROUP" ? null : this.choices,
            options: this.options?.map(value => value.build())
        }
    }

    hasPermission(member: GuildMember): boolean {
        if (this.roles == null) return true
        if (this.roles.length == 0) return true
        if (member.permissions.has("ADMINISTRATOR")) return true
            this.roles.forEach(role => {
                if (member.roles.cache.has(role)) return true
            })
        return false
    }
}

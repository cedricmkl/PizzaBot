import SlashCommand from "../command/SlashCommand";
import {
    ApplicationCommandOptionChoiceData,
    AutocompleteInteraction,
    CommandInteraction,
    GuildMember,
    Message,
    MessageEmbed,
    TextChannel
} from "discord.js";
import {Tag} from "../schema/TagModel";
import TagProvider from "../provider/TagProvider";
import Embed from "../../utils/Embed";
import UserInputUtil from "../../utils/UserInputUtil";
import PermissionsUtil from "../../utils/PermissionsUtil";
import ComponentUtil from "../../utils/ComponentUtil";
import {SlashCommandSubcommandBuilder} from "@discordjs/builders";

export default class TagCommand extends SlashCommand {


    constructor() {
        super("tag", "Tags Command")
        this.builder.addSubcommand(subCommand =>
            this.buildAutoCompleteTagSubCommand(subCommand, "tag", "Einen Tag ausgeben"))
            .addSubcommand(subCommand =>
                this.buildTagSubCommand(subCommand, "info", "Informationen über einen Tag ausgeben"))
            .addSubcommand(subCommand =>
                this.buildTagSubCommand(subCommand, "create", "Einen Tag erstellen"))
            .addSubcommand(subCommand =>
                this.buildTagSubCommand(subCommand, "edit", "Einen Tag editieren"))
            .addSubcommand(subCommand =>
                this.buildTagSubCommand(subCommand, "delete", "Einen Tag löschen (MOD ONLY)"))

        this.builder.addSubcommandGroup(subcommandGroup =>
            subcommandGroup.setName("alias")
                .setDescription("Aliases für Tags (MOD ONLY)")
                .addSubcommand(subCommand =>
                    this.buildTagAliasSubCommand(subCommand, "create", "Einen Alias erstellen (MOD ONLY)"))
                .addSubcommand(subCommand =>
                    this.buildTagAliasSubCommand(subCommand, "remove", "Einen Alias löschen (MOD ONLY)"))
        )
    }

    async autoComplete(interaction: AutocompleteInteraction) {
        if (interaction.commandName !== "tag") return
        const focused = interaction.options.getFocused(true)

        if (focused.name === "tag") {
            const input = this.formatName(focused.value as string)
            const tags = await TagProvider.getCachedTags()
            const filteredTags: ApplicationCommandOptionChoiceData[] = tags.filter(tag => tag.name.includes(input) ||
                tag.aliases.some(alias => alias.includes(input)))
                .slice(0, 10)
                .map(tag => {
                    return {
                        name: tag.name,
                        value: tag.name,
                    }
                })
            await interaction.respond(filteredTags)
        }
    }

    async execute(interaction: CommandInteraction): Promise<any> {
        await interaction.deferReply()

        switch (interaction.options.getSubcommandGroup(false)
        || interaction.options.getSubcommand()) {
            case "tag":
                return this.tag(interaction)
            case "info":
                return this.tagInfo(interaction)
            case "create":
                return this.createTag(interaction)
            case "edit":
                return this.editTag(interaction)
            case "delete":
                return this.deleteTag(interaction)
            case "alias":
                return this.tagAlias(interaction)
        }
    }

    private async sendNoPermission(interaction: CommandInteraction) {
        await interaction.editReply("Du kannst diesen Command nicht ausführen!")
    }

    private async tagAlias(interaction: CommandInteraction) {
        if (!PermissionsUtil.isModerator(interaction.member as GuildMember)) return this.sendNoPermission(interaction)
        const subCommand = interaction.options.getSubcommand()
        const tag = await this.getTag(interaction)
        const alias = interaction.options.getString("alias").toLowerCase()
        if (!tag) return interaction.editReply({
            embeds: [
                Embed.error(
                    "Tag nicht gefunden",
                    "Der Tag `" + this.getTagName(interaction) + "` wurde nicht gefunden"
                )]
        })

        switch (subCommand) {
            case "create": {
                return this.tagAliasCreate(interaction, tag, alias)
            }
            case "remove": {
                return this.tagAliasRemove(interaction, tag, alias)
            }
        }
    }

    private async tagAliasCreate(interaction: CommandInteraction, tag: Tag, alias: string) {
        if (await TagProvider.exitsTag(alias)) return interaction.editReply({
            embeds: [
                Embed.error(
                    "Tag oder Alias existiert bereits",
                    "Ein Tag oder Alias mit dem Namen `" + alias + "` existiert bereits"
                )]
        })

        tag.aliases.push(alias)
        await tag.save()
        interaction.editReply({
            embeds: [
                Embed.success(
                    "Alias erstellt",
                    "Alias `" + alias + "` für den Tag `" + tag.name + "` wurde erstellt"
                )]
        })

    }

    private async tagAliasRemove(interaction: CommandInteraction, tag: Tag, alias: string) {
        if (!tag.aliases.includes(alias)) return interaction.editReply({
            embeds: [
                Embed.error(
                    "Alias existiert nicht",
                    "Der Tag hat den Alias `" + alias + "` nicht"
                )]
        })

        tag.aliases.splice(tag.aliases.indexOf(alias), 1)
        await tag.save()
        interaction.editReply({
            embeds: [
                Embed.success(
                    "Alias entfernt",
                    "Alias `" + alias + "` für den Tag `" + tag.name + "` wurde entfernt"
                )]
        })
    }


    private async tag(interaction: CommandInteraction) {
        if (this.getTagName(interaction) == "domme") {
            return interaction.editReply({
                embeds: [new MessageEmbed({
                    title: "Domme",
                    description: "Der is schon cool oder",
                    color: "#FFFF00",
                    timestamp: Date.now(),
                    fields: [{
                        name: 'Versuch mal den Tag zu löschen pepeLaugh',
                        value: 'GEHT NICHT ROFL LUL HAHAHAHA funny ik'
                    }],
                    footer: {text: "Gebt. Domme. Geld."}
                })
                ]
            })
        }

        const tag = await this.getTag(interaction)
        if (!tag) return this.sendTagNotFund(interaction)
        interaction.editReply(tag.content)
    }

    private async tagInfo(interaction: CommandInteraction) {
        const tag = await this.getTag(interaction)
        if (!tag) return this.sendTagNotFund(interaction)
        interaction.editReply({
            embeds: [
                Embed.info(
                    `Tag ${tag.name}`,
                    null,
                    [{
                        name: "Aliases",
                        value: tag.aliases.length > 0 ? tag.aliases.map(value => "`" + value + "`").join(", ") : "keine",
                        inline: true
                    },
                        {
                            name: "Erstellt",
                            value: `<t:${Math.round(tag.createdAt.getTime() / 1000)}> (<t:${Math.round(tag.createdAt.getTime() / 1000)}:R>)`,
                            inline: true
                        }]
                )]
        })
    }

    private async createTag(interaction: CommandInteraction) {
        const tag = await this.getTag(interaction)
        if (tag) return this.sendTagAlreadyExists(interaction)
        await interaction.editReply({
            embeds: [
                Embed.info("Gebe den Content des Tags an",
                    "Gebe in den nächsten 2 Minuten den Content des Tags in diesem Channel an")
            ]
        })

        UserInputUtil.awaitInput(interaction.member as GuildMember, interaction.channel as TextChannel, 120000)
            .then(value => {
                let content = value.content
                value.attachments.forEach(value1 => content += ` ${value1.url}`)
                if (PermissionsUtil.isModerator(interaction.member as GuildMember)) {
                    this.createTagInstantly(interaction, content)
                } else this.createTagRequest(interaction, content)
            })
            .catch(() => {
                interaction.editReply({
                    embeds: [
                        Embed.error("Tag konnte nicht erstellt werden",
                            `Content wurde nicht angegeben`)
                    ]
                })
            })
    }

    private async createTagInstantly(interaction: CommandInteraction, content: string) {
        TagProvider.createTag(
            this.getTagName(interaction).toLowerCase(),
            content
        ).then(() => {
            interaction.editReply({
                embeds: [
                    Embed.success("Tag erstellt",
                        "Der Tag `" + this.getTagName(interaction) + "` wurde erstellt")
                ]
            })
        }).catch(() => {
            interaction.editReply({
                embeds: [
                    Embed.error("Tag konnte nicht erstellt werden",
                        "Ein Tag mit dem Namen `" + this.getTagName(interaction) + "` existiert bereits")
                ]
            })
        })
    }

    private async editTagInstantly(interaction: CommandInteraction, tag: Tag, content: string) {
        tag.content = content
        tag.save()
            .then(value => {
                interaction.editReply({
                    embeds: [
                        Embed.success("Tag editiert",
                            "Der Tag `" + this.getTagName(interaction) + "` wurde editiert")
                    ]
                })
            })
        TagProvider.invalidateCache()
    }

    private async createTagRequest(interaction: CommandInteraction, content: string) {

        const message: Message = await interaction.editReply({
            embeds: [
                Embed.success("Tag Request erstellt",
                    "Da du keine Rechte hast, den Tag zu erstellen oder zu editieren, wurde ein Tag Request " +
                    "erstellt! Warte bis ein Moderator deinen Tag akzeptiert")
            ],
            components: [ComponentUtil.createAcceptRejectComponents("tagRequest")]
        }) as Message

        TagProvider.createTagRequest(
            this.getTagName(interaction).toLowerCase(),
            content,
            interaction.member as GuildMember,
            message
        )
    }

    private async editTag(interaction: CommandInteraction) {
        const tag = await this.getTag(interaction)
        if (!tag) return this.sendTagNotFund(interaction)
        await interaction.editReply({
            embeds: [
                Embed.info("Gebe den Content des Tags an",
                    "Gebe in den nächsten 2 Minuten den Content des Tags in diesem Channel an")
            ]
        })

        UserInputUtil.awaitInput(interaction.member as GuildMember, interaction.channel as TextChannel, 120000)
            .then(value => {
                if (PermissionsUtil.isModerator(interaction.member as GuildMember)) {
                    this.editTagInstantly(interaction, tag, value.content)
                } else this.createTagRequest(interaction, value.content)
            })
            .catch(() => {
                interaction.editReply({
                    embeds: [
                        Embed.error("Tag konnte nicht editiert werden",
                            `Content wurde nicht angegeben`)
                    ]
                })
            })
    }

    private async tagRaw(interaction: CommandInteraction) {
        const tag = await this.getTag(interaction)
        if (!tag) return this.sendTagNotFund(interaction)

        interaction.editReply({
            content: "Raw-Version des Tags:",
            files: [{
                name: `${tag.name}.txt`,
                attachment: tag.content
            }]

        })
    }

    private async deleteTag(interaction: CommandInteraction) {
        if (!PermissionsUtil.isModerator(interaction.member as GuildMember)) return this.sendNoPermission(interaction)
        const tag = await this.getTag(interaction)
        if (!tag) return this.sendTagNotFund(interaction)
        tag.delete()

        interaction.editReply({
            embeds: [
                Embed.success(
                    "Tag gelöscht",
                    "Der Tag `" + tag.name + "` wurde gelöscht"
                )
            ]
        })
        TagProvider.invalidateCache()
    }


    private async getTag(interaction: CommandInteraction): Promise<Tag | null> {
        return await TagProvider.getTag(this.getTagName(interaction))
    }

    private getTagName(interaction: CommandInteraction): string {
        return this.formatName(interaction.options.getString("tag"))
    }

    private sendTagNotFund(interaction: CommandInteraction) {
        interaction.editReply({
            embeds: [
                Embed.error(
                    "Tag nicht gefunden",
                    "Der Tag `" + this.getTagName(interaction) + "` wurde nicht gefunden"
                )]
        })
    }

    private sendTagAlreadyExists(interaction: CommandInteraction) {
        interaction.editReply({
            embeds: [
                Embed.error(
                    "Tag existiert bereits",
                    "Der Tag `" + this.getTagName(interaction) + "` existiert bereits"
                )]
        })
    }

    private formatName(name: string): string {
        return name.toLowerCase().replace(" ", "-")
    }


    private buildTagSubCommand(builder: SlashCommandSubcommandBuilder, name: string, description: string): SlashCommandSubcommandBuilder {
        return builder.setName(name)
            .setDescription(description)
            .addStringOption(stringOption =>
                stringOption.setName("tag")
                    .setRequired(true)
                    .setDescription("Der Name des Tags"))
    }

    private buildAutoCompleteTagSubCommand(builder: SlashCommandSubcommandBuilder, name: string, description: string): SlashCommandSubcommandBuilder {
        return builder.setName(name)
            .setDescription(description)
            .addStringOption(stringOption =>
                stringOption.setName("tag")
                    .setRequired(true)
                    .setAutocomplete(true)
                    .setDescription("Der Name des Tags"))
    }

    private buildTagAliasSubCommand(builder: SlashCommandSubcommandBuilder, name: string, description: string): SlashCommandSubcommandBuilder {
        return builder.setName(name)
            .setDescription(description)
            .addStringOption(stringOption =>
                stringOption.setName("tag")
                    .setRequired(true)
                    .setDescription("Der Name des Tags"))
            .addStringOption(stringOption =>
                stringOption.setName("alias")
                    .setRequired(true)
                    .setDescription("Der Name des Aliases"))
    }

}
import { APIEmbedField, ColorResolvable, Colors, Embed, EmbedBuilder, EmbedFooterData, Emoji, RestOrArray } from "discord.js";

export function createEmbed(
    title: string = "",
    description: string = "",
    fields: Array<APIEmbedField> = [],
    color: ColorResolvable = Colors.Blurple,
    url: string = null,
    footer: EmbedFooterData = null
): EmbedBuilder {
    return new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setFields(fields)
        .setColor(color)
        .setURL(url)
        .setFooter(footer)
}


export function errorEmbed(
    title: string = "Fehler",
    description: string = ""
): EmbedBuilder {
    return createEmbed(title, `❌ ${description}`, [], Colors.Red)
}

export function successEmbed(
    title: string = "Erfolgreich",
    description: string
): EmbedBuilder {
    return createEmbed(title, `✅ ${description}`, [], Colors.Green)
}
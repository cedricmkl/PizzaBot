import { APIEmbedField, ColorResolvable, Colors, Embed, EmbedBuilder, Emoji, RestOrArray } from "discord.js";

export function createEmbed(
    title: string = "",
    description: string = "",
    fields: Array<APIEmbedField> = [],
    color: ColorResolvable = Colors.Blurple
): EmbedBuilder {
    return new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setFields(fields)
        .setColor(color)
}


export function errorEmbed(
    description: string = "",
    title: string = "Fehler"
): EmbedBuilder {
    return createEmbed(title, `❌ ${description}`, [], Colors.Red)
}

export function successEmbed(
    description: string = "",
    title: string = "Erfolgreich"
): EmbedBuilder {
    return createEmbed(title, `✅ ${description}`, [], Colors.Green)
}
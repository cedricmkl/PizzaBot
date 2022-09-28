import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ChatInputCommandInteraction, FormattingPatterns, GuildMember, IntentsBitField, ModalBuilder, TextInputBuilder, TextInputComponent, TextInputStyle } from "discord.js"
import { createOrEditTagfromTagRequest, createTag, createTagRequest, getCachedTags, getTag, getTagRequest } from "../database/database";
import { TagRequest } from "../database/model/tag-request.model";
import { createEmbed, errorEmbed, successEmbed } from "../util/embeds";
import { isModerator } from "../util/permissions";

export async function tagsCommand(interaction: ChatInputCommandInteraction) {
    switch (interaction.options.getSubcommand() || interaction.options.getSubcommandGroup(true)) {
        case "list":
            await tagsList(interaction)
            break;
        case "info":
            await tagsInfo(interaction, interaction.options.getString("name"))
            break;
        case "create":
            await tagsCreate(interaction, interaction.options.getString("name"))
            break;
    }
}


async function tagsList(interaction: ChatInputCommandInteraction) {
    const tags = await getCachedTags()
    await interaction.reply(`Alle verfügbaren Tags: ${tags.map(value => "`" + value.name + "`").join(", ")}`)
}

async function tagsInfo(interaction: ChatInputCommandInteraction, name: string) {
    const tag = await getTag(name)
    if (!tag) return await interaction.reply({ embeds: [errorEmbed("Der Tag wurde nicht gefunden.")] })
    await interaction.reply({
        embeds: [
            createEmbed(`Tag ${tag.name}`, null, [{
                name: "Aliases",
                value: tag.aliases.length > 0 ? tag.aliases.map(value => "`" + value + "`").join(", ") : "keine",
                inline: true
            },
            {
                name: "Erstellt",
                value: `<t:${Math.round(tag.createdAt.getTime() / 1000)}> (<t:${Math.round(tag.createdAt.getTime() / 1000)}:R>)`,
                inline: true
            }])
        ]
    })
}

async function tagsCreate(interaction: ChatInputCommandInteraction, name: string) {
    if (await getTag(name)) return await interaction.reply({ embeds: [errorEmbed("Einen Tag mit diesem Namen gibt es bereits.")] })

    await interaction.reply({
        embeds: [createEmbed("Gebe den Inhalt an",
            "Gebe den Inhalt des Tags an. Du hast dafuer 5 Minuten Zeit.")]
    })

    interaction.channel.awaitMessages({
        filter: (message) => message.member.user.id === interaction.user.id,
        time: 5 * 60 * 1000,
        max: 1
    }).then(async (messages) => {
        const message = messages.first()

        if (isModerator(message.member)) {
            await createTag(name, message.content)
            await interaction.editReply({
                embeds: [successEmbed("Tag erstellt",
                    `Der Tag \`${name}\` wurde erstellt.`)]
            })
            return
        }

        const repliedMessage = await interaction.editReply({
            embeds: [
                createEmbed("Tag Anfrage erstellt", "Da du keine Rechte hast, den Tag zu erstellen oder zu editieren, " +
                    "wurde eine Tag Anfrage erstellt. Warte bis ein Moderator deinen Tag akzeptiert.")
            ],
            components: [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(new ButtonBuilder()
                        .setCustomId("tagrequest_accept")
                        .setLabel("Akzeptieren")
                        .setStyle(ButtonStyle.Success))
                    .addComponents(new ButtonBuilder()
                        .setCustomId("tagrequest_reject")
                        .setLabel("Ablehnen")
                        .setStyle(ButtonStyle.Danger))
            ]
        })
        await createTagRequest(name, message.content, message.member, repliedMessage)
    }).catch(async (err) => {
        console.error(err)
        await interaction.editReply({
            embeds: [errorEmbed("Es wurde keinen Inhalt angegeben.",
                "Tag konnte nicht erstellt werden")]
        })
    })
}

async function tagsRequestButtonSubmit(interaction: ButtonInteraction) {
    if (isModerator(interaction.member as GuildMember)) return
    const request = await getTagRequest(interaction.message.id)
    if (!request) return

    if (interaction.customId === "tagrequest_accept") {
        await createOrEditTagfromTagRequest(request)
        await interaction.
    } else {

    }
}
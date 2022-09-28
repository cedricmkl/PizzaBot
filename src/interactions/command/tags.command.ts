import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, GuildMember } from "discord.js";
import { clearTagCache, createTag, createTagRequest, getCachedTags, getTag } from "../../database/database";
import { createEmbed, errorEmbed, successEmbed } from "../../util/embeds";
import { formatTagName } from "../../util/names";
import { isModerator } from "../../util/permissions";

export async function tagsCommand(interaction: ChatInputCommandInteraction) {
    switch (interaction.options.getSubcommandGroup() || interaction.options.getSubcommand(true)) {
        case "list":
            await tagsList(interaction)
            break;
        case "info":
            await tagsInfo(interaction, formatTagName(interaction.options.getString("name")))
            break;
        case "create":
            await tagsCreate(interaction, formatTagName(interaction.options.getString("name")))
            break;
        case "edit":
            await tagsEdit(interaction, formatTagName(interaction.options.getString("name")))
            break;
        case "delete":
            await tagsDelete(interaction, formatTagName(interaction.options.getString("name")))
            break;
        case "alias":
            if (interaction.options.getSubcommand() === "create") tagsAliasCreate(interaction, formatTagName(interaction.options.getString("name")), formatTagName(interaction.options.getString("alias")))
            else tagsAliasRemove(interaction, formatTagName(interaction.options.getString("name")), formatTagName(interaction.options.getString("alias")))
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
            "Gebe den Inhalt des Tags an. Du hast dafür 5 Minuten Zeit.")]
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
                createEmbed(`Tag Anfrage erstellt: \`${name}\``, "Da du keine Rechte hast, den Tag zu erstellen, " +
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

async function tagsEdit(interaction: ChatInputCommandInteraction, name: string) {
    const tag = await getTag(name)
    if (!tag) return await interaction.reply({ embeds: [errorEmbed("Einen Tag mit diesem Namen gibt es nicht.")] })

    await interaction.reply({
        embeds: [createEmbed("Gebe den Inhalt an",
            "Gebe den Inhalt des Tags an. Du hast dafür 5 Minuten Zeit.")]
    })

    interaction.channel.awaitMessages({
        filter: (message) => message.member.user.id === interaction.user.id,
        time: 5 * 60 * 1000,
        max: 1
    }).then(async (messages) => {
        const message = messages.first()

        if (isModerator(message.member)) {
            tag.content = message.content
            await tag.save()
            await interaction.editReply({
                embeds: [successEmbed("Tag bearbeitet",
                    `Der Tag \`${name}\` wurde bearbeitet.`)]
            })
            return
        }

        const repliedMessage = await interaction.editReply({
            embeds: [
                createEmbed(`Tag Anfrage erstellt: \`${name}\``, "Da du keine Rechte hast, den Tag zu bearbeiten, " +
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
                "Tag konnte nicht bearbeitet werden")]
        })
    })
}

async function tagsDelete(interaction: ChatInputCommandInteraction, name: string) {
    if (!isModerator(interaction.member as GuildMember)) return

    const tag = await getTag(name)
    if (!tag) return await interaction.reply({ content: "Der Tag wurde nicht gefunden.", ephemeral: true })

    await tag.delete()
    clearTagCache()
    await interaction.reply(`Der Tag \`${name}\` wurde gelöscht.`)
}

async function tagsAliasCreate(interaction: ChatInputCommandInteraction, name: string, alias: string) {
    if (!isModerator(interaction.member as GuildMember)) return
    const tag = await getTag(name)
    if (!tag || await getTag(alias)) {
        return await interaction.reply({
            content: "Diesen Tag gibt es nicht oder ein Alias/Tag mit diesem Namen existiert bereits.",
            ephemeral: true
        })
    }

    if (tag.aliases.includes(alias)) {
        return await interaction.reply({
            content: "Dieser Tag hat diesen Alias bereits.",
            ephemeral: true
        })
    }

    tag.aliases = [...tag.aliases, alias]
    await tag.save()

    await interaction.reply({
        embeds: [successEmbed("Alias hinzugefügt", `Der Alias \`${alias}\` wurde dem Tag \`${name}\` hinzugefügt.`)]
    })
}

async function tagsAliasRemove(interaction: ChatInputCommandInteraction, name: string, alias: string) {
    if (!isModerator(interaction.member as GuildMember)) return
    const tag = await getTag(name)
    if (!tag) {
        return await interaction.reply({
            content: "Diesen Tag gibt es nicht.",
            ephemeral: true
        })
    }

    if (!tag.aliases.includes(alias)) {
        return await interaction.reply({
            content: "Dieser Tag hat diesen Alias nicht.",
            ephemeral: true
        })
    }

    tag.aliases.splice(tag.aliases.indexOf(alias), 1)
    await tag.save()

    await interaction.reply({
        embeds: [successEmbed("Alias enfernt", `Der Alias \`${alias}\` wurde dem Tag \`${name}\` entfernt.`)]
    })
}
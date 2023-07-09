import { AutocompleteInteraction, ButtonInteraction, ChatInputCommandInteraction, Client, CommandInteraction, Interaction } from "discord.js";
import { tagAutocomplete } from "./autocomplete/tag.autocomplete";
import { tagsRequestButtonSubmit } from "./button/tag-request.button";
import { colorCommand } from "./command/color.command";
import { googleCommand } from "./command/google.command";
import { infoCommand } from "./command/info.command";
import { tagCommand } from "./command/tag.command";
import { tagsCommand } from "./command/tags.command";


export function registerInteractions(client: Client) {

    client.on("interactionCreate", (interaction) => {
        if (interaction.isChatInputCommand()) handleCommand(interaction)
        else if (interaction.isAutocomplete()) handleAutoComplete(interaction)
        else if (interaction.isButton()) handleButton(interaction)
    })
}


async function handleCommand(interaction: ChatInputCommandInteraction) {
    console.log(`[COMMAND] /${interaction.commandName} - ${interaction.user.tag}`)

    try {
        switch (interaction.commandName) {
            case "tag":
                await tagCommand(interaction)
                break
            case "tags":
                await tagsCommand(interaction)
                break
            case "google":
                await googleCommand(interaction)
                break
            case "info":
                await infoCommand(interaction)
                break
            case "color":
                await colorCommand(interaction)
                break
        }
    } catch (err) {
        console.error(err)
        errorReply(interaction, "Es ist ein Fehler beim ausführen dieses Befehls aufgetreten", err, false)
    }
}

async function handleAutoComplete(interaction: AutocompleteInteraction) {
    console.log(`[AUTO-COMPLETE] /${interaction.commandName} - ${interaction.user.tag}`)

    switch (interaction.commandName) {
        case "tag":
        case "tags":
            await tagAutocomplete(interaction)
            break;
    }
}

async function handleButton(interaction: ButtonInteraction) {
    console.log(`[BUTTON] ${interaction.customId} - ${interaction.user.tag}`)

    try {
        if (interaction.customId.startsWith("tagrequest_")) await tagsRequestButtonSubmit(interaction)
    } catch (err) {
        console.error(err)
        await errorReply(interaction, "Es ist ein Fehler aufgetreten", err, true)
    }
}

async function errorReply(interaction: ChatInputCommandInteraction | ButtonInteraction, message: string, err: Error, ephemeral: boolean) {
    if (interaction.replied || interaction.deferred) {
        await interaction.editReply({ content: `${message}: ${err.name}` })
    } else {
        await interaction.reply({ content: `${message}: ${err.name}`, ephemeral })
    }
}
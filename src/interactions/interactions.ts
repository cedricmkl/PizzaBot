import { AutocompleteInteraction, ButtonInteraction, ChatInputCommandInteraction, Client, CommandInteraction } from "discord.js";
import { tagAutocomplete } from "./autocomplete/tag.autocomplete";
import { tagsRequestButtonSubmit } from "./button/tag-request.button";
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
        }
    } catch (err) {
        console.error(err)
        if (interaction.replied || interaction.deferred) {
            await interaction.editReply("Es ist ein Fehler beim ausführen dieses Befehls aufgetreten.")
        } else {
            await interaction.reply("Es ist ein Fehler beim ausführen dieses Befehls aufgetreten.")
        }
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

    switch (interaction.customId) {
        case "tagrequest_accept":
        case "tagrequest_reject":
            await tagsRequestButtonSubmit(interaction)
            break;
    }
}
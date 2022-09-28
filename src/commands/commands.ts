import { AutocompleteInteraction, ChatInputCommandInteraction, Client, CommandInteraction } from "discord.js";
import { tagAutocomplete, tagCommand } from "./tag.command";
import { tagsCommand } from "./tags.command";

const commands = new Map<string, Function>

export function registerCommandListeners(client: Client) {

    client.on("interactionCreate", (interaction) => {
        if (interaction.isChatInputCommand()) handleCommand(interaction)
        else if (interaction.isAutocomplete()) handleAutoComplete(interaction)
    })

    commands.set("tag", tagCommand)
    commands.set("tags", tagsCommand)

}


async function handleCommand(interaction: ChatInputCommandInteraction) {
    console.debug(`[COMMAND] /${interaction.commandName} - ${interaction.user.tag}`)

    const command = commands.get(interaction.commandName)
    if (!command) return console.debug(`[UNHANDLED] /${interaction.commandName} - ${interaction.user.tag}`)

    try {
        await command(interaction)
    } catch (err) {
        console.error(err)
    }
}

async function handleAutoComplete(interaction: AutocompleteInteraction) {
    console.debug(`[AUTO-COMPLETE] /${interaction.commandName} - ${interaction.user.tag}`)

    switch (interaction.commandName) {
        case "tag":
        case "tags":
            await tagAutocomplete(interaction)
            break;
    }
}
require("dotenv").config()
import {SlashCommandBuilder} from "@discordjs/builders";
import {REST} from "@discordjs/rest";
import {Routes} from "discord-api-types/v9";
import GoogleCommand from "./bot/commands/GoogleCommand";
import InfoCommand from "./bot/commands/InfoCommand";
import TagCommand from "./bot/commands/TagCommand";
import TagsCommand from "./bot/commands/TagsCommand";
const commands: Array<SlashCommandBuilder> = []

commands.push(new GoogleCommand().build())
commands.push(new InfoCommand().build())
commands.push(new TagCommand().build())
commands.push(new TagsCommand().build())


const restClient = new REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN)

restClient.put(Routes.applicationGuildCommands(process.env.DISCORD_APPLICATION_ID, process.env.GUILD),
    { body: commands })
    .then(() => console.log("Sucessfully registered Commands!"))
    .catch(console.error)



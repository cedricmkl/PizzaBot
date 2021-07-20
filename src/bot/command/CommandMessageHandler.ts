import {Message} from "discord.js";
import SlashCommand from "./SlashCommand";

export default abstract class CommandMessageHandler extends SlashCommand {
    abstract handleMessage(message: Message)
}
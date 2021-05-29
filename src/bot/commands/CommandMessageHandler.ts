import {Message} from "discord.js";
import Command from "./Command";

export default abstract class CommandMessageHandler extends Command{
    abstract handleMessage(message: Message)
}
import {Message} from "discord.js";

export default abstract class TextCommand {

    protected constructor(readonly name: string, readonly prefixNeeded: boolean = false) {

    }

    abstract execute(message: Message, params: string[])

}
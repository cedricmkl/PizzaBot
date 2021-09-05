import TextCommand from "../command/TextCommand";
import {Message} from "discord.js";
import TagProvider from "../provider/TagProvider";

export default class TagsTextCommand extends TextCommand {
    constructor() {
        super("tags");
    }

    async execute(message: Message, params: string[]) {
        //TODO: Paginator
        const tags = await TagProvider.getTags()
        message.channel.send(`Alle verfügbaren Tags: ${tags.map(value => "`" + value.name + "`").join(", ")}`)
    }

}
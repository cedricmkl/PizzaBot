import SlashCommand from "../command/SlashCommand";
import {CommandInteraction} from "discord.js";
import TagProvider from "../provider/TagProvider";

export default class TagsCommand extends SlashCommand {

    constructor() {
        super("tags", "Zeige alle Tags an")
    }

    async execute(interaction: CommandInteraction): Promise<any> {
        //TODO: Paginator
        await interaction.deferReply()
        const tags = await TagProvider.getTags();
        interaction.editReply(`Alle verfügbaren Tags: ${tags.map(value => "`" + value.name + "`").join(", ")}`)
    }
}
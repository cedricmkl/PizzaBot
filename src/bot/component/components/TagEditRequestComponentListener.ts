import ComponentListener from "../ComponentListener";
import {MessageComponentInteraction} from "discord.js";
import PermissionsUtil from "../../../utils/PermissionsUtil";
import TagProvider from "../../provider/TagProvider";

export default class TagEditRequestComponentListener extends ComponentListener {

    constructor() {
        super(["acceptTagRequestEdit", "rejectTagRequestEdit"]);
    }

    async handleInteraction(interaction: MessageComponentInteraction) {
        if (!PermissionsUtil.canExecute([process.env.MOD_ROLE], interaction.member)) return interaction.reply("Du kannst das nicht tun", {ephemeral: true})
        await interaction.defer()
        const messageID = interaction.message.id

        const request = await TagProvider.getTagRequest(messageID)
        if (!request) return interaction.editReply("Der Tag-Request wurde bereits bearbeitet")
        const tag = await TagProvider.getTag(request.tag.name)
        interaction.message.edit({components: []})
        await request.delete()
        if (!tag) return interaction.editReply("Tag existiert nicht")

        switch (interaction.customID) {
            case "acceptTagRequestEdit": {
                tag.content = request.tag.content
                await tag.save()
                await interaction.editReply("Tag editiert")
                break;
            }
            case "rejectTagRequestEdit": {
                request.delete()
                await interaction.editReply("Tag-Request abgelehnt")
            }
        }
    }
}
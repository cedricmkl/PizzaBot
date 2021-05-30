import ComponentListener from "../ComponentListener";
import {MessageComponentInteraction} from "discord.js";
import PermissionsUtil from "../../../utils/PermissionsUtil";
import TagProvider from "../../provider/TagProvider";

export default class TagCreateRequestComponentListener extends ComponentListener {

    constructor() {
        super(["acceptTagRequest", "rejectTagRequest"]);
    }

    async handleInteraction(interaction: MessageComponentInteraction) {
        if (!PermissionsUtil.canExecute([process.env.MOD_ROLE], interaction.member)) return interaction.reply("Du kannst das nicht tun", {ephemeral: true})
        await interaction.defer()
        const messageID = interaction.message.id

        const request = await TagProvider.getTagRequest(messageID)
        if (!request) return interaction.editReply("Der Tag-Request wurde bereits bearbeitet")

        switch (interaction.customID) {
            case "acceptTagRequest": {
                request.delete()
                TagProvider.createTag(request.tag.name, request.tag.content, request.tag.createdAt)
                    .then(() => interaction.editReply("Tag erfolgreich erstellt"))
                    .catch(() => interaction.editReply("Ein Tag mit diesem namen existiert bereits"))
                break;
            }
            case "rejectTagRequest": {
                request.delete()
                await interaction.editReply("Tag-Request abgelehnt")
            }
        }
        interaction.message.edit({components: []})

    }
}
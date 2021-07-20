import ButtonListener from "../ButtonListener";
import {ButtonInteraction, GuildMember, Message} from "discord.js";
import TagProvider from "../../provider/TagProvider";
import ComponentUtil from "../../../utils/ComponentUtil";
import Embed from "../../../utils/Embed";
import PermissionsUtil from "../../../utils/PermissionsUtil";

export default class TagRequestListener extends ButtonListener {
    constructor() {
        super("tagRequest");
    }

    async handleInteraction(interaction: ButtonInteraction, value: string) {
        if (!PermissionsUtil.canExecute([process.env.MOD_ROLE], interaction.member as GuildMember)) {
            return interaction.reply({
                embeds: [
                    Embed.error(
                        "Nicht genügend Rechte",
                        `Du kannst das nicht tun`
                    )],
                ephemeral: true
            })
        }

        const tagRequest = await TagProvider.getTagRequest(interaction.message.id)
        if (!tagRequest) return ComponentUtil.disableAllButtons(interaction.message as Message)
        switch (value) {
            case "accept": {

                await TagProvider.createOrEditTag(tagRequest)
                await (interaction.message as Message).edit({
                    embeds: [
                        Embed.success(
                            "Tag Request wurde angenommen",
                            `<@${interaction.user.id}> hat den Tag Request angenommen`
                        )]
                })
                await interaction.reply({ephemeral: true, content: "Angenommen!"})
                return ComponentUtil.disableAllButtons(interaction.message as Message)
            }
            case "reject": {
                await tagRequest.delete();
                await (interaction.message as Message).edit({
                    embeds: [
                        Embed.error(
                            "Tag Request wurde abgelehnt",
                            `<@${interaction.user.id}> hat den Tag Request abgelehnt`
                        )]
                })
                await interaction.reply({ephemeral: true, content: "Abgelehnt!"})
                return ComponentUtil.disableAllButtons(interaction.message as Message)
            }
        }

    }

}
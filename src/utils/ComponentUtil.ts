import {MessageComponentResolvable} from "discord.js";

export default class ComponentUtil {

    static acceptRejectComponent(acceptData: { label: string, customID: string }, rejectData: { label: string, customID: string }): MessageComponentResolvable {
        return {
            type: "ACTION_ROW",
            components: [
                {
                    type: "BUTTON",
                    label: acceptData.label,
                    style: "SUCCESS",
                    customID: acceptData.customID
                },
                {
                    type: "BUTTON",
                    label: rejectData.label,
                    style: "DANGER",
                    customID: rejectData.customID
                }
            ]

        }
    }
}
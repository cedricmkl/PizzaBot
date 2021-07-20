import {ButtonInteraction} from "discord.js";

export default abstract class ButtonListener {
    identifier: string

    protected constructor(identifier: string) {
        this.identifier = identifier;
    }

    abstract handleInteraction(interaction: ButtonInteraction, value: string);
}
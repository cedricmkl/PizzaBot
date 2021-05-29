import {MessageComponentInteraction} from "discord.js";

export default abstract class ComponentListener {
    ids: string[]
    protected constructor(ids: string[]) {
        this.ids = ids;
    }

    abstract handleInteraction(interaction: MessageComponentInteraction);
}
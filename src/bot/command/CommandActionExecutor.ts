import SlashCommandUtil from "../../utils/command/SlashCommandUtil";
import {Client, MessageEmbed, WebhookClient} from "discord.js";

export default class CommandActionExecutor {
    readonly client: Client
    readonly slashCommandInteractionToken: string
    readonly slashCommandInteractionID: string


    constructor(client: Client, slashCommandInteractionToken: string, slashCommandInteractionID: string) {
        this.client = client;
        this.slashCommandInteractionToken = slashCommandInteractionToken;
        this.slashCommandInteractionID = slashCommandInteractionID;
    }

    async sendThinking()  {
        return await SlashCommandUtil.sendThinking(this.client, this.slashCommandInteractionID, this.slashCommandInteractionToken);
    }

    async sendUserMessage(message: MessageEmbed | string) {
        return await SlashCommandUtil.sendUserMessage(this.client, this.slashCommandInteractionID, this.slashCommandInteractionToken, message)
    }

    async sendWebhookMessage(message: MessageEmbed | string) {
        return await new WebhookClient(this.client.user.id, this.slashCommandInteractionToken).send(message);
    }

}
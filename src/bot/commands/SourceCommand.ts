import Command from "../command/Command";
import {Client, GuildMember, Message, MessageEmbed} from "discord.js";
import CommandActionExecutor from "../command/CommandActionExecutor";
import CommandArguments from "../command/CommandArguments";
import {Octokit} from "@octokit/rest";

export default class SourceCommand extends Command {
    private github: Octokit = new Octokit();
    constructor() {
        super("source", "Zeigt einen Link zum Source Code und Stats an", false);
    }

    async executeSlash(client: Client, member: GuildMember, args: CommandArguments, executor: CommandActionExecutor) {
        await executor.sendThinking()
        this.createEmbed().then(value => executor.sendWebhookMessage(value))
    }

    async executeTextCommand(client: Client, input: string[], member: GuildMember, message: Message) {
        this.createEmbed().then(value => message.channel.send(value))
    }

    async createEmbed(): Promise<MessageEmbed> {
        const embed = new MessageEmbed({
            title: "Ich bin Open Source",
            url: "https://github.com/CoolePizza/PizzaBot",
            color: "#03f8fc",
            description: "Kicke [hier](https://github.com/CoolePizza/PizzaBot) um den Source Code anzusehen.\n\n",
            timestamp: new Date()
        });

        const githubData = await this.github.rest.repos.get({owner: "CoolePizza", repo: "PizzaBot"});
        if (!githubData.data) return embed;
        embed.setFooter(githubData.data.full_name)
        embed.setAuthor(githubData.data.owner.login, githubData.data.owner.avatar_url, githubData.data.owner.url)
        embed.addFields([
            {
                name: "Stars ⭐",
                value: githubData.data.stargazers_count,
                inline: true
            }
        ])
        return embed;
    }
}
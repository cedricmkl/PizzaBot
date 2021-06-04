import Command from "../Command";
import {Client, GuildMember, Message, MessageEmbed} from "discord.js";
import {Octokit} from "@octokit/rest";

export default class SourceCommand extends Command {
    private github: Octokit = new Octokit();

    constructor() {
        super("source", "Zeigt einen Link zum Source Code und Stats an", false);
    }

    async executeSlash(client, command) {
        await command.defer()
        this.createEmbed().then(value => command.editReply(value))
    }

    async executeText(client: Client, input: string[], member: GuildMember, message: Message) {
        this.createEmbed().then(value => message.channel.send(value))
    }

    async createEmbed(): Promise<MessageEmbed> {
        const data = {user: "CoolePizza", repo: "PizzaBot"};

        const url = `https://github.com/${data.user}/${data.repo}`

        const embed = new MessageEmbed({
            title: "Ich bin Open Source",
            url: url,
            color: "#03f8fc",
            description: `Kicke [hier](${url}) um den Source Code anzusehen.`,
            timestamp: new Date()
        });

        const githubData = await this.github.rest.repos.get({owner: data.user, repo: data.repo});
        if (!githubData.data) return embed;
        embed.setFooter(`${data.user}/${data.repo}`)
        embed.setAuthor(githubData.data.owner.login, githubData.data.owner.avatar_url, githubData.data.owner.url)
        embed.addFields([
            {
                name: "Stars ⭐",
                value: githubData.data.stargazers_count
            }
        ])
        return embed;
    }
}
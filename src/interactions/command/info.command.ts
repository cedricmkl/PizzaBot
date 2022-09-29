import { ChatInputCommandInteraction, Colors } from "discord.js";
import { createEmbed } from "../../util/embeds";
import fetch from 'node-fetch';

export async function infoCommand(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply()
    const repo: GithubRepo = await (await fetch(`https://api.github.com/repos/cedricmkl/PizzaBot`)).json() as GithubRepo
    const contributors: Array<GithubContributor> = await (await fetch(repo.contributors_url)).json() as Array<GithubContributor>

    const embed = createEmbed(
        repo.name,
        `Ich bin Open Source! Kicke [hier](${repo.html_url}) um den Source Code anzusehen.`,
        [],
        Colors.Green,
        repo.html_url,
        {
            text: repo.full_name
        }
    )

    embed.addFields(
        {
            name: "Github Stars ⭐",
            value: repo.stargazers_count.toString(),
            inline: true
        },
        {
            name: "Mitwirkende",
            value: contributors.map(value => `[${value.login}](${value.html_url})`)
                .join(", "),
            inline: true
        }
    )

    embed.setAuthor({
        name: repo.owner.login,
        url: repo.owner.html_url,
        iconURL: repo.owner.avatar_url
    })

    await interaction.editReply({
        embeds: [embed]
    })
}


interface GithubContributor {
    login: string,
    html_url: string,
    avatar_url: string
}

interface GithubRepo {
    name: string,
    owner: GithubContributor,
    html_url: string,
    full_name: string,
    contributors_url: string,
    stargazers_count: number
}
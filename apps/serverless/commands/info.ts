import { APIChatInputApplicationCommandInteraction as SlashInteraction } from "https://deno.land/x/discord_api_types@0.37.39/v10.ts";
import { message, ApplicationCommandInteractionResponse as SlashResponse } from "https://deno.land/x/discordinteractions@v0.1.3.1/mod.ts";

type GithubContributor = {
    login: string,
    html_url: string,
    avatar_url: string
}

type GithubRepo = {
    name: string,
    owner: GithubContributor,
    html_url: string,
    full_name: string,
    contributors_url: string,
    stargazers_count: number
}


export default async (_: SlashInteraction): Promise<SlashResponse> => {
    const repo: GithubRepo = await (await fetch(`https://api.github.com/repos/cedricmkl/PizzaBot`)).json() as GithubRepo
    const contributors: Array<GithubContributor> = await (await fetch(repo.contributors_url)).json() as Array<GithubContributor>
    return message({
        embeds: [{
            title: repo.full_name,
            url: repo.html_url,
            color: 0x42e3f5,
            description: `Ich bin Open Source! Kicke [hier](${repo.html_url}) um den Source Code anzusehen.`,
            author: {
                name: repo.owner.login,
                url: repo.owner.html_url,
                icon_url: repo.owner.avatar_url
            },
            fields: [
                {
                    name: "Stars",
                    value: `${repo.stargazers_count} ⭐`,
                },
                {
                    name: "Contributors",
                    value: contributors.map(c => `[${c.login}](${c.html_url})`).join(", "),
                    inline: true
                }
            ]
        }]
    })
}
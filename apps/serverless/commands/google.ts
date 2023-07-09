import { message, slashParser } from "https://deno.land/x/discordinteractions@v0.1.3.1/mod.ts";
import "https://deno.land/std@0.193.0/dotenv/load.ts";

const GOOGLE_KEY = Deno.env.get("GOOGLE_KEY")!,
    GOOGLE_CX = Deno.env.get("GOOGLE_CX")!;

type SearchResponse = {
    items: Result[];
}

type Result = {
    title: string;
    link: string;
}

export default slashParser()
    .base(async (_, options) => {
        const query = options["query"] as string;
        const results = await search(query);
        if (!results || results.length === 0) return message({ content: "Keine Ergebnisse gefunden." });
        return message({
            embeds: [{
                title: `Suchergebnisse für \`${query}\``,
                description: results
                    .slice(0, 10)
                    .map((r, i) => `${i + 1}. [${r.title}](${r.link})`)
                    .join("\n")
            }]
        })
    })


export async function search(query: string): Promise<Result[]> {
    const res = await fetch(`https://www.googleapis.com/customsearch/v1?key=${GOOGLE_KEY}&cx=${GOOGLE_CX}&q=${query}`);
    if (!res.ok) {
        console.log(res.status, await res.json())
        throw new Error("Failed to fetch results from Google");
    }
    const json: SearchResponse = await res.json();
    return json.items;
}
import { interactions, message } from "https://deno.land/x/discordinteractions@v0.1.1/mod.ts";
import { serve } from "https://deno.land/std@0.183.0/http/server.ts";
import info from "./commands/info.ts";
import google from "./commands/google.ts";
import "https://deno.land/std@0.193.0/dotenv/load.ts";


const client = interactions({
    publicKey: Deno.env.get("DISCORD_PUBLIC_KEY")!,
})
    .slash("info", info)
    .slash("google", async (i) => await google.handle(i))
    .error((_, e) => {
        console.log(e);
        return message({ content: `Ein Fehler ist aufgetreten: ${e.message}` })
    });

serve(client.handle);
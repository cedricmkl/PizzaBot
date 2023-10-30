import {
  addRole,
  createBot,
  Intents,
  sendMessage,
  snowflakeToBigint,
  startBot,
} from "https://deno.land/x/discordeno@13.0.0/mod.ts";
import "https://deno.land/std@0.193.0/dotenv/load.ts";

const bot = createBot({
  token: Deno.env.get("DISCORD_TOKEN")!,
  intents: Intents.Guilds | Intents.GuildMessages | Intents.GuildMembers,
  events: {
    ready() {
      console.log("Successfully connected to gateway");
    },
    async threadCreate(bot, thread) {
      if (!thread.newlyCreated) return;
      await sendMessage(bot, thread.id, {
        embeds: [
          {
            title: "Tipps zum Fragestellen",
            description:
              "Um dir bestmöglich und schnell helfen zu können, teile bitte alle relevanten Informationen zu deinem Problem in diesem Thread. Dazu gehören eine Beschreibung des Problems, wie es eigentlich funktionieren sollte und falls vorhanden, Code-Snippets oder Fehlermeldungen. Weitere Informationen darüber, wie du deine Fragen am besten stellen kannst, findest du in dem Kanal <#808665677929512961>.",
          },
        ],
      });
    },
    async guildMemberAdd(bot, member) {
      await addRole(
        bot,
        member.guildId,
        member.id,
        snowflakeToBigint(Deno.env.get("MEMBER_ROLE_ID")!)
      );
    },
  },
});

await startBot(bot);

import { PermissionsBitField, REST, Routes, SlashCommandBuilder, SlashCommandStringOption } from "discord.js"


const commands = [
    //color
    new SlashCommandBuilder()
        .setName("color")
        .setDescription("Farben fuer Booster & Moderatoren.")
        .addSubcommand((command) => command.setName("reset").setDescription("Setze deine Rollenfarbe zurueck."))
        .addSubcommand((command) =>
            command.setName("set").setDescription("Setze deine Farbe.")
                .addStringOption(option => option.setName("color").setDescription("Die Farbe (HEX).").setRequired(true))),
    //admin
    new SlashCommandBuilder()
        .setName("admin")
        .setDescription("Admin Command")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addStringOption((option) =>
            option.setName("action")
                .setDescription("Die Aktion.")
                .addChoices({
                    name: "Rollen erstellen",
                    value: "create_roles"
                })
                .setRequired(true)),
    //google
    new SlashCommandBuilder()
        .setName("google")
        .setDescription("Suche mit Google.")
        .addStringOption((option) =>
            option.setName("query")
                .setDescription("Der Search Term.")
                .setRequired(true)),
    //info
    new SlashCommandBuilder()
        .setName("info")
        .setDescription("Zeige Informationen über den Bot an."),
    //tag
    new SlashCommandBuilder()
        .setName("tag")
        .setDescription("Zeige einen Tag an.")
        .addStringOption((option) =>
            option.setName("name")
                .setDescription("Der Name des Tags.")
                .setAutocomplete(true)
                .setRequired(true)),
    new SlashCommandBuilder()
        .setName("tags")
        .setDescription("Alles was mit Tags zutun hat!")
        //tags list
        .addSubcommand((command) =>
            command.setName("list")
                .setDescription("Zeige alle Tags an."))
        //tags info
        .addSubcommand((command) =>
            command.setName("info")
                .setDescription("Zeige Informationen zu einem Tag an")
                .addStringOption((option) =>
                    option.setName("name")
                        .setDescription("Der Name des Tags.")
                        .setAutocomplete(true)
                        .setRequired(true)))
        //tags create
        .addSubcommand((command) =>
            command.setName("create")
                .setDescription("Erstelle einen Tag.")
                .addStringOption((option) =>
                    option.setName("name")
                        .setDescription("Der Name des Tags.")
                        .setRequired(true)))
        //tags edit
        .addSubcommand((command) =>
            command.setName("edit")
                .setDescription("Bearbeite einen Tag.")
                .addStringOption((option) =>
                    option.setName("name")
                        .setDescription("Der Name des Tags.")
                        .setAutocomplete(true)
                        .setRequired(true)))
        //tags delete
        .addSubcommand((command) =>
            command.setName("delete")
                .setDescription("Lösche einen Tag.")
                .addStringOption((option) =>
                    option.setName("name")
                        .setDescription("Der Name des Tags.")
                        .setAutocomplete(true)
                        .setRequired(true)))
        //tags alias
        .addSubcommandGroup((group) =>
            group.setName("alias")
                .setDescription("Tag Aliases")
                .addSubcommand((command) =>
                    command.setName("create")
                        .setDescription("Erstelle einen Tag Alias.")
                        .addStringOption((option) =>
                            option.setName("name")
                                .setDescription("Der Name des Tags.")
                                .setAutocomplete(true)
                                .setRequired(true))
                        .addStringOption((option) =>
                            option.setName("alias")
                                .setDescription("Der neue Alias.")
                                .setRequired(true)))
                .addSubcommand((command) =>
                    command.setName("remove")
                        .setDescription("Lösche einen Tag Alias.")
                        .addStringOption((option) =>
                            option.setName("name")
                                .setDescription("Der Name des Tags.")
                                .setAutocomplete(true)
                                .setRequired(true))
                        .addStringOption((option) =>
                            option.setName("alias")
                                .setDescription("Der Alias.")
                                .setRequired(true)))
        )

]

const restClient = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN)
restClient.put(Routes.applicationGuildCommands(process.env.DISCORD_APPLICATION_ID, process.env.GUILD),
    { body: commands })
    .then(() => console.log("Sucessfully registered Commands!"))
    .catch(console.error)
import {ColorResolvable, EmbedField, MessageEmbed} from "discord.js";

export default class Embed {
    static error(title: string, description: string, fields: EmbedField[] = [], url?: string): MessageEmbed {
        return this.embed(title, "❌ " + description, "RED", fields, url)
    }

    static success(title: string, description: string, fields: EmbedField[] = [], url?: string): MessageEmbed {
        return this.embed(title, "✅ " + description, "GREEN", fields, url)
    }

    static info(title: string, description: string, fields: EmbedField[] = [], url?: string): MessageEmbed {
        return this.embed(title, description, "BLURPLE", fields, url)
    }


    static embed(title: string, description: string, color: ColorResolvable = "GREEN", fields: EmbedField[] = [], url?: string): MessageEmbed {
        return new MessageEmbed({
            title: title,
            url: url,
            description: description,
            color: color,
            fields: fields
        })
    }
}
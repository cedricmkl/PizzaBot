const hastebin = require("hastebin-gen")

export default class PasteUtil {

    static async paste(content: string): Promise<string> {
        return await hastebin(content, {url: "https://just-paste.it", extension: "txt"});
    }
}
import TagModel from "../schema/TagModel";
import TagSchema, {Tag} from "../schema/TagModel";
import {GuildMember, Message, Util} from "discord.js";
import TagRequestSchema, {TagRequest} from "../schema/TagRequest";

export default class TagProvider {

    static async getTag(name: string): Promise<Tag> {
        return TagModel.findOne({$or: [{name: name.toLowerCase()}, {aliases: name.toLowerCase()}]});
    }

    static async exitsTag(name: string): Promise<boolean> {
        return TagModel.exists({$or: [{name: name.toLowerCase()}, {aliases: name.toLowerCase()}]})
    }

    static async createTag(name: string, content: string, createdAt: Date = new Date()): Promise<Tag> {
        content = Util.removeMentions(content)
        name = Util.removeMentions(name)

        return await TagModel.create({
            name: name,
            content: content,
            createdAt: createdAt
        });
    }

    static async createTagRequest(name: string, content: string, guildMember: GuildMember, message: Message): Promise<TagRequest> {
        content = Util.removeMentions(content)
        name = Util.removeMentions(name)

        return await TagRequestSchema.create(
            {
                createdBy: guildMember.id,
                messageID: message.id,
                tag: {
                    name: name,
                    content: content,
                    createdAt: new Date()
                }
            }
        )

    }

    static async createOrEditTag(tagRequest: TagRequest) {
        await TagSchema.updateOne({name: tagRequest.tag.name}, {
            name: tagRequest.tag.name,
            content: tagRequest.tag.content
        }, {upsert: true, setDefaultsOnInsert: true})
        await tagRequest.delete()
    }

    static async getTagRequest(messageID: string): Promise<TagRequest> {
        return TagRequestSchema.findOne({messageID: messageID})
    }

    static async getTags(): Promise<Array<Tag>> {
        return TagModel.find();
    }
}
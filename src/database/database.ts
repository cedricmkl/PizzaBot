import { GuildMember, Message } from "discord.js"
import { connect } from "mongoose"
import { exit } from "process"
import tagRequestModel, { TagRequest } from "./model/tag-request.model"
import tagModel, { Tag } from "./model/tag.model"

export const connectToMongoDB = async () => {
    console.debug("Trying to connect to MongoDB")
    try {
        await connect(process.env.MONGO_URI)
        console.debug("Connected to mongodb")
    } catch (err) {
        console.error("Failed To Connect to MongoDB", err)
        exit(-1)
    }
}

let tagCache: Array<Tag> = []

export async function getTag(name: string): Promise<Tag> {
    return tagModel.findOne({ name: name })
}

export async function exitsTag(name: string): Promise<boolean> {
    return getTag(name) != null
}

export async function createTag(name: string, content: string, createdAt: Date = new Date()): Promise<Tag> {
    clearTagCache()
    return await tagModel.create({
        name,
        content,
        createdAt
    })
}

export async function createTagRequest(name: string, content: string, member: GuildMember, message: Message): Promise<TagRequest> {
    return await tagRequestModel.create(
        {
            createdBy: member.id,
            messageID: message.id,
            tag: {
                name: name,
                content: content,
                createdAt: new Date()
            }
        }
    )

}

export async function createOrEditTagfromTagRequest(tagRequest: TagRequest) {
    await tagModel.updateOne({ name: tagRequest.tag.name }, {
        name: tagRequest.tag.name,
        content: tagRequest.tag.content
    }, { upsert: true, setDefaultsOnInsert: true })
    await tagRequest.delete()
    this.invalidateCache()
}

export async function getTagRequest(messageID: string): Promise<TagRequest> {
    return tagRequestModel.findOne({ messageID: messageID })
}

export async function getCachedTags(): Promise<Array<Tag>> {
    if (tagCache.length === 0) {
        tagCache = await tagModel.find()
    }
    return tagCache
}

export async function clearTagCache() {
    tagCache = []
}
import TagModel, {Tag} from "../schema/TagModel";

export default class TagProvider {

    static async getTag(name: string) : Promise<Tag>{
        return TagModel.findOne({$or: [{name: name.toLowerCase()}, {aliases: name.toLowerCase()}]});
    }

    static async exitsTag(name: string) : Promise<boolean>{
        return TagModel.exists({$or: [{name: name.toLowerCase()}, {aliases: name.toLowerCase()}]})
    }

    static async createTag(name: string, content: string) : Promise<Tag>{
        return await TagModel.create({
            name: name,
            content: content
        });
    }

    static async getTags() : Promise<Array<Tag>>{
        return TagModel.find();
    }
}
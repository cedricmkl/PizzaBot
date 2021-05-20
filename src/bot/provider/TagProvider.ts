import TagModel, {Tag} from "../schema/TagModel";

export default class TagProvider {

    static async getTag(name: string) : Promise<Tag>{
        return TagModel.findOne({$or:[{name: name.toLowerCase()},{aliases: name.toLowerCase()}]});
    }
}
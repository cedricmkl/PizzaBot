import {CommandParameterType, getOptionID} from "./CommandParameterType";

export default class CommandParameter {
    readonly name: String;
    readonly description: String;

    readonly type: CommandParameterType;
    readonly required: boolean;

    constructor(name: String, description: String, type: CommandParameterType, required: boolean) {
        this.name = name;
        this.type = type;
        this.required = required;
        this.description = description;
    }

    toOption() : object{
        return {
            name: this.name,
            description: this.description,
            type: getOptionID(this.type),
            required: this.required
        }
    }
}
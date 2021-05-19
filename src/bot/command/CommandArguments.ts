import CommandArgument from "./CommandArgument";
import CommandParameter from "./CommandParameter";

export default class CommandArguments {
    arguments: CommandArgument[] = [];

    parseData(rawData: [object], parameters: CommandParameter[]) {
        parameters.forEach(value => {
            // @ts-ignore
            let argument = rawData.find(data => data.name === value.name);
            if (argument) {
                // @ts-ignore
                this.arguments.push(new CommandArgument(argument.name, argument.value))
            }
        })
    }

    getArgument(name: String): CommandArgument {
        return this.arguments.find(arg => arg.name === name)
    }

    hasArgument(name: String): boolean {
        return this.getArgument(name) != undefined;
    }
}
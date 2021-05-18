
export enum CommandParameterType {
    STRING, INTEGER, BOOLEAN, USER, CHANNEL, ROLE, MENTIONABLE
}

//https://discord.com/developers/docs/interactions/slash-commands#applicationcommandoptiontype
export function getOptionID(parameterType: CommandParameterType) : number {
    switch (parameterType) {
        case CommandParameterType.STRING:
            return 3
        case CommandParameterType.INTEGER:
            return 4
        case CommandParameterType.BOOLEAN:
            return 5
        case CommandParameterType.USER:
            return 6
        case CommandParameterType.CHANNEL:
            return 7
        case CommandParameterType.ROLE:
            return 8
        case CommandParameterType.MENTIONABLE:
            return 9;
    }
    return 3
}
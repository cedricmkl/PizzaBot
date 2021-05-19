export default class CommandArgument {
    readonly name: String;
    readonly value: any;

    constructor(name: String, value: any) {
        this.name = name;
        this.value = value;
    }

    getAsString(): string {
        return this.value;
    }

    getAsInt(): number {
        return this.value;
    }

    getAsBoolean(): boolean {
        return this.value;
    }

    //NOT IMPLEMENTED
    getAsUser(): string {
        return this.value;
    }

    //NOT IMPLEMENTED
    getAsChannel(): string {
        return this.value;
    }

    //NOT IMPLEMENTED
    getAsRole(): string {
        return this.value;
    }

    //NOT IMPLEMENTED
    getAsMentionable(): string {
        return this.value;
    }
}
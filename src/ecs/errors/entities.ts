export class EntityDoesNotExist extends Error {
    constructor(entityID: string) {
        super(`The entity "${entityID}" does not exist`);
        Object.setPrototypeOf(this, EntityDoesNotExist.prototype);
    }
}

export class InvalidEntityAssociation extends Error {
    constructor() {
        super("Invalid Entity Association")
        Object.setPrototypeOf(this, InvalidEntityAssociation.prototype);
    }
}
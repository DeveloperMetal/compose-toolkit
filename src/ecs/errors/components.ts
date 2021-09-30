export class ComponentDoesNotExist extends Error {
    constructor(componentId: unknown) {
        super();
        this.message = `Component "${componentId} does not exist`;
        Object.setPrototypeOf(this, ComponentDoesNotExist.prototype);
    }
}
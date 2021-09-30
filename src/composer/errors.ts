export class ExtensionMissing extends Error {
    constructor(extensionName: string) {
        super(`Extension ${extensionName} is missing.`)
    }
}
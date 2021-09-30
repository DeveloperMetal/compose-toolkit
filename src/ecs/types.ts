import { IConstructor } from "../composer/types";

export interface IComponent {
}

export type EntityID = string;
export type ComponentID = string;

export type System<T extends IComponent> = {
    name: string,
    pipeline?: string,
    component: IConstructor<IComponent>,
    filter?: (component: T) => boolean,
    exec: (component: T) => Promise<void> | void,
    begin?: (pipeline: string, count: number) => Promise<void> | void,
    end?: (pipeline: string, count: number) => Promise<void> | void
}
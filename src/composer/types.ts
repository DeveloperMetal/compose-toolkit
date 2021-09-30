import { Extension } from ".";

export type TEvent = string | symbol;
export type TEventCallback = (obj: object, ...args: any[]) => void;

export type IConstructor<T> = new (...args:any[]) => T;

export const EVT_BEFORE_INIT = Symbol("beforeInit");
export const EVT_INIT = Symbol("init");
export const EVT_AFTER_INIT = Symbol("afterInit");
export const EVT_BROADCAST = Symbol("broadcast");

import { IComponent } from "../ecs/types";
import { EVT_AFTER_INIT, EVT_BEFORE_INIT, EVT_BROADCAST, EVT_INIT, IConstructor, TEvent, TEventCallback } from "./types";

export type ExtensionDefiniton = {
    as: string,
    extension: IConstructor<Extension>
} | IConstructor<Extension>;

export class Controller {
    protected _extensions = new Map<IConstructor<Extension>, Extension>();
    protected _events = new Map<TEvent, Set<TEventCallback>>();
    protected _one = new Map<TEvent, Set<TEventCallback>>();

    private _initialized = false;

    constructor(extensions: ExtensionDefiniton[]) {
        for(const factory of extensions) {
            if ( typeof factory === "function" ) {
                const extension = new factory(this);
                this._extensions.set(factory, extension);
            } else {
                const extension = new factory.extension(this);
                this._extensions.set(factory.extension, extension);
                Reflect.set(this, factory.as, extension);
            }
        }
    }

    get initialized() {
        return this._initialized;
    }

    getComponent<T extends Extension>(extension: IConstructor<T>):T | undefined {
        return this._extensions.get(extension) as T;
    }

    async broadcast(event: TEvent , ...args:any[]) {
        const evMethod: TEvent = typeof event === "string"?`on${event[0].toUpperCase()}${event.substr(1)}`:event;
        const _ev = this._events.get(event);
        const promises: Promise<void>[] = [];

        for(const extension of this._extensions.values()) {
            const member = Reflect.get(extension, evMethod);
            if ( typeof member === "function" ) {
                await Promise.resolve(Reflect.apply(member, extension, args));
            }
        }

        if ( event != EVT_BROADCAST ) {
            await this.broadcast(EVT_BROADCAST, event, ...args);
        }

        if ( _ev ) {
            for(const listener of _ev.values()) {
                const _one = this._one.get(event);
                if ( _one && _one.has(listener) ) {
                    this.off(event, listener);
                }
                promises.push(Promise.resolve(listener(this, ...args)));
            }
        }

        await Promise.allSettled(promises);
    }

    on(event: TEvent, callback: TEventCallback) {
        let _ev = this._events.get(event);
        if ( !_ev ) {
            _ev = new Set();
            this._events.set(event, _ev);
        }

        _ev.add(callback);
        return this;
    }

    off(event: TEvent, callback: TEventCallback) {
        let _ev = this._events.get(event);
        if ( !_ev ) {
            return this;
        }
        _ev.delete(callback);

        let _one = this._one.get(event);
        if ( !_one ) {
            return this;
        }
        _one.delete(callback);
        return this;
    }

    once(event: TEvent, callback: TEventCallback) {
        this.on(event, callback);
        let _one = this._one.get(event);
        if ( !_one) {
            _one = new Set();
            this._one.set(event, _one);
        }
        _one.add(callback);
        return this;
    }

    async init(): Promise<void> {
        await this.broadcast(EVT_BEFORE_INIT);
        await this.broadcast(EVT_INIT);
        this._initialized = true;
        await this.broadcast(EVT_AFTER_INIT);
    }
}

export class Extension {
    constructor(readonly controller: Controller) {
    }

    protected async broadcast(event: TEvent, ...args: any[]) {
        return this.controller.broadcast(event, ...args);
    }
}

export function Compose(...extensions: ExtensionDefiniton[]) {
    return class extends Controller {
        constructor() {
            super(extensions);
        }
    }
}
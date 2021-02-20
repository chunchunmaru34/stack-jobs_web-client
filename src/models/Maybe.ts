import { IFunctor } from '@interfaces/index';

export class Maybe<T> implements IFunctor<T> {
    static of<T>(x?: T) {
        return new Maybe(x);
    }

    static Nothing<T>() {
        return new Maybe<T>(null);
    }

    static Just<T>(x: NonNullable<T>): Maybe<T> {
        return new Maybe(x);
    }

    get isNothing() {
        return this._value === null || this._value === undefined;
    }

    get isJust() {
        return !this.isNothing;
    }

    constructor(private _value: T | null | undefined) {}

    map<TResult>(fn: (value: T) => TResult): Maybe<TResult> {
        return this.isNothing ? Maybe.Nothing() : Maybe.of(fn(this._value!));
    }

    flatMap<R>(fn: (d: NonNullable<T>) => Maybe<R>): Maybe<R | null> {
        return this.isNothing ? Maybe.Nothing() : fn(this._value as NonNullable<T>);
    }

    valueOrDefault(defaultValue: T): T {
        return this.isNothing ? defaultValue : this._value!;
    }

    valueOrThrow(message: string) {
        if (this.isNothing) {
            throw new Error(message);
        }

        return this._value;
    }

    getValue() {
        return this._value;
    }

    toString() {
        return `Maybe(${this._value})`;
    }
}

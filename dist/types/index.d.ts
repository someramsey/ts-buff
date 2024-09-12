/// <reference types="node" />
import { Serializable } from "./core";
export type BufferContext = {
    buffer: Buffer;
    offset: number;
};
export declare function bufferContext(size: number): BufferContext;
export declare function rewindContext(context: BufferContext): BufferContext;
export declare function int32(): Serializable<number>;
export declare function int16(): Serializable<number>;
export declare function int8(): Serializable<number>;
export declare function uint32(): Serializable<number>;
export declare function uint16(): Serializable<number>;
export declare function uint8(): Serializable<number>;
export declare function float32(): Serializable<number>;
export declare function float64(): Serializable<number>;
export declare function string(maxSize: number): Serializable<string>;
export declare function boolean(): Serializable<boolean>;
export declare function date(): Serializable<Date>;
export declare function object<T extends {
    [key: string]: Serializable<any>;
}, U extends {
    [K in keyof T]: T[K]["__type"];
}>(fields: T): Serializable<U>;
export declare function array<T, U extends T[]>(itemSchema: Serializable<T>, maxLength: number): Serializable<U>;
declare const _default: {
    readonly bufferContext: typeof bufferContext;
    readonly int32: typeof int32;
    readonly int16: typeof int16;
    readonly int8: typeof int8;
    readonly uint32: typeof uint32;
    readonly uint16: typeof uint16;
    readonly uint8: typeof uint8;
    readonly float32: typeof float32;
    readonly float64: typeof float64;
    readonly string: typeof string;
    readonly boolean: typeof boolean;
    readonly date: typeof date;
    readonly object: typeof object;
    readonly array: typeof array;
};
export default _default;

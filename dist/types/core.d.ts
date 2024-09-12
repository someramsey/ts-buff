import type { BufferContext } from "./index";
type Writer<T> = (context: BufferContext, value: T) => void;
type Reader<T> = (context: BufferContext) => T;
export type Serializable<T = any> = {
    readonly __type: T;
    readonly size: number;
    readonly write: Writer<T>;
    readonly read: Reader<T>;
};
export type SerializableOptions<T> = Omit<Serializable<T>, '__type'>;
export declare function createSerializable<T>(options: SerializableOptions<T>): Serializable<T>;
export {};

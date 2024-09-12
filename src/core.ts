import type { BufferContext } from "./index";

type Writer<T> = (context: BufferContext, value: T) => void;
type Reader<T> = (context: BufferContext) => T;

export type Serializable<T = any> = {
    readonly __type: T;
    readonly size: number;
    readonly write: Writer<T>;
    readonly read: Reader<T>;
}

export type SerializableOptions<T> = Omit<Serializable<T>, '__type'>;

export function createSerializable<T>(options: SerializableOptions<T>): Serializable<T> {
    return { 
        size: options.size,
        write: (context: BufferContext, value: T) => {
            options.write(context, value);
            context.offset += options.size;
        },
        read: (context: BufferContext) => {
            const value = options.read(context);
            context.offset += options.size;
            return value;
        }
    } as Serializable<T>;
}
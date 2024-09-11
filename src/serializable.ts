import type { BufferContext } from ".";

type Writer<T> = (context: BufferContext, value: T) => void;
type Reader<T> = (context: BufferContext) => T;

export type Serializable<T = any> = {
    readonly __type: T;
    readonly size: number;
    readonly required: boolean;
    readonly write: Writer<T>;
    readonly read: Reader<T>;
}

export function createSerializable<T>(options: { size: number, required: boolean | undefined, write: Writer<T>, read: Reader<T> }): Serializable<T> {
    return {
        size: options.size,
        required: options.required ?? true,
        write: (context, value) => {
            options.write(context, value);
            context.offset += options.size;
        },
        read: (context) => {
            const value = options.read(context);
            context.offset += options.size;

            return value;
        }
    } as Serializable<T>
}

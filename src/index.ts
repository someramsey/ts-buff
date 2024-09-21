import { createSerializable, Serializable, SerializableOptions } from "./core";

export type BufferContext = {
    buffer: Buffer;
    offset: number;
};

export function bufferContext(size: number): BufferContext {
    return { buffer: Buffer.alloc(size), offset: 0 };
}

export function rewindContext(context: BufferContext): BufferContext {
    context.offset = 0;
    return context;
}

export function int32(): Serializable<number> {
    return createSerializable({
        size: 4,
        write: (context, value) => context.buffer.writeInt32LE(value, context.offset),
        read: (context) => context.buffer.readInt32LE(context.offset)
    });
}

export function int16(): Serializable<number> {
    return createSerializable({
        size: 2,
        write: (context, value) => context.buffer.writeInt16LE(value, context.offset),
        read: (context) => context.buffer.readInt16LE(context.offset)
    });
}

export function int8(): Serializable<number> {
    return createSerializable({
        size: 1,
        write: (context, value) => context.buffer.writeInt8(value, context.offset),
        read: (context) => context.buffer.readInt8(context.offset)
    });
}

export function uint32(): Serializable<number> {
    return createSerializable({
        size: 4,
        write: (context, value) => context.buffer.writeUInt32LE(value, context.offset),
        read: (context) => context.buffer.readUInt32LE(context.offset)
    });
}

export function uint16(): Serializable<number> {
    return createSerializable({
        size: 2,
        write: (context, value) => context.buffer.writeUInt16LE(value, context.offset),
        read: (context) => context.buffer.readUInt16LE(context.offset)
    });
}

export function uint8(): Serializable<number> {
    return createSerializable({
        size: 1,
        write: (context, value) => context.buffer.writeUInt8(value, context.offset),
        read: (context) => context.buffer.readUInt8(context.offset)
    });
}

export function float32(): Serializable<number> {
    return createSerializable({
        size: 4,
        write: (context, value) => context.buffer.writeFloatLE(value, context.offset),
        read: (context) => context.buffer.readFloatLE(context.offset)
    });
}

export function float64(): Serializable<number> {
    return createSerializable({
        size: 8,
        write: (context, value) => context.buffer.writeDoubleLE(value, context.offset),
        read: (context) => context.buffer.readDoubleLE(context.offset)
    });
}

export function string(maxSize: number,): Serializable<string> {
    return createSerializable({
        size: maxSize,
        write: (context, value) => {
            if (value.length > maxSize) {
                throw new Error(`String is too long. Max size is ${maxSize} but got ${value.length}`);
            }

            context.buffer.write(value, context.offset, maxSize)
        },
        read: (context) => context.buffer.toString("utf-8", context.offset, context.offset + maxSize)
    });
}

export function boolean(): Serializable<boolean> {
    return createSerializable({
        size: 1,
        write: (context, value) => context.buffer.writeUInt8(value ? 1 : 0, context.offset),
        read: (context) => context.buffer.readUInt8(context.offset) === 1,
    });
}

export function date(): Serializable<Date> {
    return createSerializable({
        size: 8,
        write: (context, value) => context.buffer.writeBigInt64LE(BigInt(value.getTime()), context.offset),
        read: (context) => new Date(Number(context.buffer.readBigInt64LE(context.offset))),
    });
}

export function object<
    T extends { [key: string]: Serializable<any> },
    U extends { [K in keyof T]: T[K]["__type"] }
>(fields: T,): Serializable<U> {
    return {
        size: Object.values(fields).reduce((size, field) => size + field.size, 0),

        write: (context, value) => {
            for (const [key, field] of Object.entries(fields)) {
                field.write(context, value[key as keyof T]);
            }
        },

        read: (context) => {
            const obj = {} as U;

            for (const key of Object.keys(fields)) {
                obj[key as keyof T] = fields[key].read(context);
            }

            return obj;
        }
    } satisfies SerializableOptions<U> as Serializable<U>;
}

export function array<T, U extends T[]>(itemSchema: Serializable<T>, maxLength: number): Serializable<U> {
    return {
        size: itemSchema.size * maxLength + 4,
        write: (context, value) => {
            if (!Array.isArray(value)) {
                throw new Error("Value is not an array");
            }

            if (value.length > maxLength) {
                throw new Error("Array is too long");
            }

            context.buffer.writeUInt32LE(value.length, context.offset);
            context.offset += 4;

            for (const item of value) {
                itemSchema.write(context, item);
            }
        },

        read: (context) => {
            const length = context.buffer.readUInt32LE(context.offset);
            context.offset += 4;

            const array: U = new Array(length) as U;

            for (let i = 0; i < length; i++) {
                array[i] = itemSchema.read(context);
            }

            return array;
        }
    } satisfies SerializableOptions<U> as Serializable<U>;
}

export default { bufferContext, int32, int16, int8, uint32, uint16, uint8, float32, float64, string, boolean, date, object, array } as const;

export * from "./core"
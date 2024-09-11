import { createSerializable, Serializable } from "./serializable";

export type BufferContext = {
    buffer: Buffer;
    offset: number;
};

export function bufferContext(buffer: Buffer, offset: number = 0): BufferContext {
    return { buffer, offset };
}

export function int32(required?: boolean): Serializable<number> {
    return createSerializable({
        size: 4,
        required,
        write: (context, value) => context.buffer.writeInt32LE(value, context.offset),
        read: (context) => context.buffer.readInt32LE(context.offset)
    });
}

export function int16(required?: boolean): Serializable<number> {
    return createSerializable({
        size: 2,
        required,
        write: (context, value) => context.buffer.writeInt16LE(value, context.offset),
        read: (context) => context.buffer.readInt16LE(context.offset)
    });
}

export function int8(required?: boolean): Serializable<number> {
    return createSerializable({
        size: 1,
        required,
        write: (context, value) => context.buffer.writeInt8(value, context.offset),
        read: (context) => context.buffer.readInt8(context.offset)
    });
}

export function uint32(required?: boolean): Serializable<number> {
    return createSerializable({
        size: 4,
        required,
        write: (context, value) => context.buffer.writeUInt32LE(value, context.offset),
        read: (context) => context.buffer.readUInt32LE(context.offset)
    });
}

export function uint16(required?: boolean): Serializable<number> {
    return createSerializable({
        size: 2,
        required,
        write: (context, value) => context.buffer.writeUInt16LE(value, context.offset),
        read: (context) => context.buffer.readUInt16LE(context.offset)
    });
}

export function uint8(required?: boolean): Serializable<number> {
    return createSerializable({
        size: 1,
        required,
        write: (context, value) => context.buffer.writeUInt8(value, context.offset),
        read: (context) => context.buffer.readUInt8(context.offset)
    });
}

export function float32(required?: boolean): Serializable<number> {
    return createSerializable({
        size: 4,
        required,
        write: (context, value) => context.buffer.writeFloatLE(value, context.offset),
        read: (context) => context.buffer.readFloatLE(context.offset)
    });
}

export function float64(required?: boolean): Serializable<number> {
    return createSerializable({
        size: 8,
        required,
        write: (context, value) => context.buffer.writeDoubleLE(value, context.offset),
        read: (context) => context.buffer.readDoubleLE(context.offset)
    });
}

export function string(size: number, required?: boolean): Serializable<string> {
    return createSerializable({
        size,
        required,
        write: (context, value) => context.buffer.write(value, context.offset, size),
        read: (context) => context.buffer.toString('utf-8', context.offset, context.offset + size)
    });
}

export function boolean(required?: boolean): Serializable<boolean> {
    return createSerializable({
        size: 1,
        required,
        write: (context, value) => context.buffer.writeUInt8(value ? 1 : 0, context.offset),
        read: (context) => context.buffer.readUInt8(context.offset) === 1,
    });
}

export function date(required?: boolean): Serializable<Date> {
    return createSerializable({
        size: 8,
        required,
        write: (context, value) => context.buffer.writeBigInt64LE(BigInt(value.getTime()), context.offset),
        read: (context) => new Date(Number(context.buffer.readBigInt64LE(context.offset))),
    });
}

export function object<
    T extends { [key: string]: Serializable<any> },
    U extends { [K in keyof T]: T[K]['__type'] }
>(fields: T, required?: boolean): Serializable<U> {
    return createSerializable({
        required,
        size: Object.values(fields).reduce((size, field) => size + field.size, 0),
        write: (context, value) => Object.entries(fields).forEach(([key, field]) => {
            field.write(context, value[key as keyof T]);
        }),
        read: (context) => Object.keys(fields).reduce((obj, key) => {
            obj[key as keyof T] = fields[key].read(context);
            return obj;
        }, {} as U)
    });
}

export function array<
    T extends Serializable<any>[],
    U extends { [K in keyof T]: T[K]["__type"] }
>(items: T, required?: boolean): Serializable<U> {
    return createSerializable({
        required,
        size: items.reduce((size, item) => size + item.size, 0),
        write: (context, value) => items.forEach((item, index) => item.write(context, value[index])),
        read: (context) => items.map(item => item.read(context)) as U
    })

}

export default { bufferContext, int32, int16, int8, uint32, uint16, uint8, float32, float64, string, boolean, date, object, array } as const;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.array = exports.object = exports.date = exports.boolean = exports.string = exports.float64 = exports.float32 = exports.uint8 = exports.uint16 = exports.uint32 = exports.int8 = exports.int16 = exports.int32 = exports.rewindContext = exports.bufferContext = void 0;
const core_1 = require("./core");
function bufferContext(size) {
    return { buffer: Buffer.alloc(size), offset: 0 };
}
exports.bufferContext = bufferContext;
function rewindContext(context) {
    context.offset = 0;
    return context;
}
exports.rewindContext = rewindContext;
function int32() {
    return (0, core_1.createSerializable)({
        size: 4,
        write: (context, value) => context.buffer.writeInt32LE(value, context.offset),
        read: (context) => context.buffer.readInt32LE(context.offset)
    });
}
exports.int32 = int32;
function int16() {
    return (0, core_1.createSerializable)({
        size: 2,
        write: (context, value) => context.buffer.writeInt16LE(value, context.offset),
        read: (context) => context.buffer.readInt16LE(context.offset)
    });
}
exports.int16 = int16;
function int8() {
    return (0, core_1.createSerializable)({
        size: 1,
        write: (context, value) => context.buffer.writeInt8(value, context.offset),
        read: (context) => context.buffer.readInt8(context.offset)
    });
}
exports.int8 = int8;
function uint32() {
    return (0, core_1.createSerializable)({
        size: 4,
        write: (context, value) => context.buffer.writeUInt32LE(value, context.offset),
        read: (context) => context.buffer.readUInt32LE(context.offset)
    });
}
exports.uint32 = uint32;
function uint16() {
    return (0, core_1.createSerializable)({
        size: 2,
        write: (context, value) => context.buffer.writeUInt16LE(value, context.offset),
        read: (context) => context.buffer.readUInt16LE(context.offset)
    });
}
exports.uint16 = uint16;
function uint8() {
    return (0, core_1.createSerializable)({
        size: 1,
        write: (context, value) => context.buffer.writeUInt8(value, context.offset),
        read: (context) => context.buffer.readUInt8(context.offset)
    });
}
exports.uint8 = uint8;
function float32() {
    return (0, core_1.createSerializable)({
        size: 4,
        write: (context, value) => context.buffer.writeFloatLE(value, context.offset),
        read: (context) => context.buffer.readFloatLE(context.offset)
    });
}
exports.float32 = float32;
function float64() {
    return (0, core_1.createSerializable)({
        size: 8,
        write: (context, value) => context.buffer.writeDoubleLE(value, context.offset),
        read: (context) => context.buffer.readDoubleLE(context.offset)
    });
}
exports.float64 = float64;
function string(maxSize) {
    return (0, core_1.createSerializable)({
        size: maxSize,
        write: (context, value) => {
            if (value.length > maxSize) {
                throw new Error(`String is too long. Max size is ${maxSize} but got ${value.length}`);
            }
            context.buffer.write(value, context.offset, maxSize);
        },
        read: (context) => context.buffer.toString("utf-8", context.offset, context.offset + maxSize)
    });
}
exports.string = string;
function boolean() {
    return (0, core_1.createSerializable)({
        size: 1,
        write: (context, value) => context.buffer.writeUInt8(value ? 1 : 0, context.offset),
        read: (context) => context.buffer.readUInt8(context.offset) === 1,
    });
}
exports.boolean = boolean;
function date() {
    return (0, core_1.createSerializable)({
        size: 8,
        write: (context, value) => context.buffer.writeBigInt64LE(BigInt(value.getTime()), context.offset),
        read: (context) => new Date(Number(context.buffer.readBigInt64LE(context.offset))),
    });
}
exports.date = date;
function object(fields) {
    return {
        size: Object.values(fields).reduce((size, field) => size + field.size, 0),
        write: (context, value) => {
            for (const [key, field] of Object.entries(fields)) {
                field.write(context, value[key]);
            }
        },
        read: (context) => {
            const obj = {};
            for (const key of Object.keys(fields)) {
                obj[key] = fields[key].read(context);
            }
            return obj;
        }
    };
}
exports.object = object;
function array(itemSchema, maxLength) {
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
            const array = new Array(length);
            for (let i = 0; i < length; i++) {
                array[i] = itemSchema.read(context);
            }
            return array;
        }
    };
}
exports.array = array;
exports.default = { bufferContext, int32, int16, int8, uint32, uint16, uint8, float32, float64, string, boolean, date, object, array };
//# sourceMappingURL=index.js.map
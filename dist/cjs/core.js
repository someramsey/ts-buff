"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSerializable = void 0;
function createSerializable(options) {
    return {
        size: options.size,
        write: (context, value) => {
            options.write(context, value);
            context.offset += options.size;
        },
        read: (context) => {
            const value = options.read(context);
            context.offset += options.size;
            return value;
        }
    };
}
exports.createSerializable = createSerializable;
//# sourceMappingURL=core.js.map
export function createSerializable(options) {
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
//# sourceMappingURL=core.js.map
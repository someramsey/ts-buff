## Ts-Buff - A buffer serialization library 
---

Ts-Buff is a simple and small serialization library that allows you to serialize and deserialize objects in a buffer format with a schema-based api. Serialized chunks can only have fixed sizes, so you will need to define maximum sizes for dynamic data types like strings or decimal types.

## Installation

```bash
npm install ts-buff
```


## Usage

Define a schema with the fields you need. Then create a buffer context with the appropriate size. (The required size can be acquired using `schema.size`). Once you create a buffer context you can call `schema.write` to write the object to the buffer, and `schema.read` to read it back.

> Note that the buffer context will move with each read/write operation, so you will need to reset it with `tsbuff.rewindContext` if you want to read the buffer again.

```typescript
import tsbuff from 'ts-buff';

//Define a schema
const schema = tsbuff.object({
    someNumber: tsbuff.uint32(),
    someBool: tsbuff.boolean()
});

//Create a buffer context and write to it
const context = tsbuff.bufferContext(schema.size);

schema.write(context, { 
    someNumber: 1,
    someBool: true
});

console.log(context.buffer); // -> <Buffer 01 00 00 00 01>


//Reset the context offset and read it
tsbuff.rewindContext(context);

console.log(schema.read(context)); // -> { someNumber: 1, someBool: true }
```

> Currently the serialization completely fails up on mismatched types or malformed input, so make sure to use the correct types when reading and writing.

--- 

Due to how the serialization is implemented dynamically sized types like strings or arrays must be defined with a predefined size. This means that you will need to define a maximum size for these types.

```typescript
import tsbuff from 'ts-buff';

tsbuff.string(10); // A string with a maximum size of 10
tsbuff.array(tsbuff.uint32(), 10); // An array with a maximum size of 10
```

##### Numeric types
- `tsbuff.int8()`: 8-bit signed integer
- `tsbuff.int16()`: 16-bit signed integer
- `tsbuff.int32()`: 32-bit signed integer
- `tsbuff.uint8()`: 8-bit unsigned integer
- `tsbuff.uint16()`: 16-bit unsigned integer
- `tsbuff.uint32()`: 32-bit unsigned integer
- `tsbuff.float32()`: 32-bit floating point number
- `tsbuff.float64()`: 64-bit floating point number

##### Other types 
- `tsbuff.boolean()`: a boolean
- `tsbuff.date()`: a date object
- `tsbuff.string(size)`: a string with a fixed size
- `tsbuff.array(schema, size)`: an array with a fixed size
- `tsbuff.object(schema)`: an object with a fixed size


### Utility functions

```typescript
//Creates a buffer context with the given size.
tsbuff.bufferContext(size: number): BufferContext 

//Resets the buffer context offset to 0.
tsbuff.rewindContext(context: BufferContext): void 
```

## Creating Custom Types

You can also create your own custom serializable types. Every type must have a `size` property that returns the size of the type in bytes, a `write` and `read` method that handle the serialization and deserialization of the type.

```typescript
import { createSerializable } from 'ts-buff/core';

function int512(): Serializable<number> {
    return createSerializable({
        size: 512,
        write: (context, value) => context.buffer.writeIntLE(value, context.offset, 512),
        read: (context) => context.buffer.readIntLE(context.offset, 512) 
    });
}

```



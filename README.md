# Hello, World in Deno with WASM from Zig

A minimalistic guide for creating a 'Hello, World!' app in Deno using
WebAssembly compiled from Zig, showcasing cross-language integration and WASM
usage.

## Zig code

this example uses the at the this time latest stable version of Zig v0.11.0.

- new Zig project:
  ```sh
  zig init-exe
  ```

- replace contents of `src/main.zig`:
  ```zig
  // Define a global constant for the message
  const message = "Hello, World!\n";

  export fn getHelloWorld() [*]const u8 {
      return message.ptr;
  }

  export fn getHelloWorldLength() usize {
      return message.len;
  }

  pub export fn main() void {
      // Initialize or do something in main
  }
  ```

- compile to a WASM module:
  ```bash
  zig build-exe -dynamic -rdynamic -target wasm32-freestanding -O ReleaseSmall src/main.zig
  ```
  we need to add `-dynamic -rdynamic` so that the functions are correctly
  exported.

- now we should have two new files in our root folder:
  - `main.wasm`
  - `main.wasm.o`

## Deno code

using current version of Deno v1.39.1.

- create a file in root folder `hello-world.ts` with following content:
  ```ts
  // Load the WASM file
  const wasmCode = await Deno.readFile("hello-world.wasm");

  // Compile and instantiate the module
  const wasmModule = new WebAssembly.Module(wasmCode);
  const wasmInstance = new WebAssembly.Instance(wasmModule);

  // Access the exported functions
  const offset = wasmInstance.exports.getHelloWorld as CallableFunction;
  const length = wasmInstance.exports.getHelloWorldLength as CallableFunction;

  // TypeScript type assertions
  const memory = wasmInstance.exports.memory as WebAssembly.Memory;

  // Create a view of the memory
  const memoryArray = new Uint8Array(memory.buffer, offset(), length());

  // Convert the memory bytes to a JavaScript string
  const helloWorld = new TextDecoder().decode(memoryArray);

  console.log(helloWorld); // Outputs: Hello, World!
  ```

- run script:
  ```sh
  deno run --allow-read hello-world.ts
  ```

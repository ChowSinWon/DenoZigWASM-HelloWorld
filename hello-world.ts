// Load the WASM file
const wasmCode = await Deno.readFile("main.wasm");

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

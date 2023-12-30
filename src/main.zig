// Define a global constant for the message
const message = "Hello, World!\n";

export fn getHelloWorld() [*]const u8 {
    return message.ptr;
}

export fn getHelloWorldLength() usize {
    return message.len;
}

export fn main() void {
    // Initialize or do something in main
}

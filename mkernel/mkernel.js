import { FileSystem } from '../filesystem/filesystem.js'

export const name = 'mkernel';

export { MKernel }

class MKernel {
    constructor() {
        this.pid = 1;
        this.processes = {};
        this.filesystem = new FileSystem();
    }

    start(program) {
        var pid = this.pid++;
        this.processes[pid] = new Process(pid, program);
    }
}

// This is a record that contains running processes and any metadata about them.
class Process {
    constructor(pid, program) {
        this.pid = pid;
        this.program = program;
    }
}
export const name = 'nterm';

export { NTerm }


class NTerm {
    // Pass in the HTML element which will have a terminal instantiated inside.
    constructor(elem) {
        if (typeof (elem) === 'string') {
            elem = document.querySelector(elem);
        }
        this.prompt = 'Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ';
        this.init(elem);

        // TOOD: limit the number of commands kept.
        this.commands = [];
    }

    init(elem) {
        this.term = new window.Terminal(
            {
                allowProposedApi: true,
                cursorBlink: true
            }
        );
        this.term.onData((e) => this.onData(e));
        this.term.open(elem);
        this.term.focus();

        this.showPrompt();
    }

    showPrompt() {
        this.resetCommand();
        this.term.write(this.prompt, () => {
            this.term.promptLength = this.term._core.buffer.x;
        });
    }

    resetCommand() {
        this.command = '';
    }

    onData(e) {
        var term = this.term;
        switch (e) {
            case '\u0003': // Ctrl+C
                term.write('^C\r\n', () => this.showPrompt());
                break;
            case '\r': // Enter
                this.onEnter();
                break;
            case '\u007F': // Backspace (DEL)
                console.log('backspace');
                // Do not delete the prompt
                if (term._core.buffer.x > term.promptLength) {
                    term.write('\b \b');
                    if (this.command.length > 0) {
                        this.command = this.command.substr(0, this.command.length - 1);
                    }
                }
                break;
            case '\u0009':
                // what do?
                // console.log('tabbed', output, ["dd", "ls"]);
                break;
            default:
                if (e >= String.fromCharCode(37) && e <= String.fromCharCode(40)) {
                    this.arrow(e);
                }

                if (e >= String.fromCharCode(0x20) && e <= String.fromCharCode(0x7E) || e >= '\u00a0') {
                    this.command += e;
                    term.write(e);
                }
        }
    }

    arrow(e) {
        switch (e) {
            case 37: // Left
                break;
            case 38: // Up
                break;
            case 39: // Right
                break;
            case 40: // Down
                break;
            default:
                throw Error(`NTerm.arrow: ${e} is not an arrow key code`);
        }
    }

    onEnter() {
        this.commands.push(this.command);
        this.term.writeln(`\n\r${this.command}`, () => this.showPrompt());
    }

    // Add a window.load event to start the terminal, good for standalone usages of nterm.
    // Example:
    // Mterm.createOnLoad(document.querySelector('div.terminal'));
    static createOnLoad(querySelector) {
        window.addEventListener('load', (event) => {
            // This is how you would instantiate 
            var mterm = new NTerm(querySelector);
        });
    }
}
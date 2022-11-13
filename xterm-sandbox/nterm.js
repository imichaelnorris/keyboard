function prompt(term) {
    // reset command.
    term.command = '';
    term.write(term.prompt, () => {
        term.promptLength = term._core.buffer.x;
    });
}

function onEnter(term) {
    term.writeln(`\n\r${term.command}`, () => prompt(term));
}

window.addEventListener('load', (event) => {
    // https://xtermjs.org/docs/api/terminal/interfaces/iterminaloptions/
    var term = new window.Terminal(
        {
            allowProposedApi: true,
            cursorBlink: true
        }
    );
    term.open(document.querySelector('div.terminal'));
    term.focus();
    //term.loadAddon(new CanvasAddon());
    //term.loadAddon(new WebLinksAddon());
    //term.loadAddon(new WebglAddon());
    term.prompt = 'Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ';
    prompt(term);

    term.onData(e => {
        switch (e) {
            case '\u0003': // Ctrl+C
                term.write('^C', () => prompt(term));
                break;
            case '\r': // Enter
                onEnter(term);
                break;
            case '\u007F': // Backspace (DEL)
                // Do not delete the prompt
                if (term._core.buffer.x > term.promptLength) {
                    term.write('\b \b');
                    if (term.command.length > 0) {
                        term.command = term.command.substr(0, term.command.length - 1);
                    }
                }
                break;
            case '\u0009':
                // what do?
                // console.log('tabbed', output, ["dd", "ls"]);
                break;
            default:
                if (e >= String.fromCharCode(0x20) && e <= String.fromCharCode(0x7E) || e >= '\u00a0') {
                    term.command += e;
                    term.write(e);
                }
        }
    });
});
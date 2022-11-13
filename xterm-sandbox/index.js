function prompt(term) {
    // reset command.
    term.command = '';
    term.write(term.prompt);
    term.promptLength = term._core.buffer.x;
}

function onEnter(term) {
    term.write(`${term.command}\r\n$`);
}

window.onload = (event) => {
    var term = new window.Terminal(
        {
            allowProposedApi: true,
            cursorBlink: true
        }
    );
    term.open(document.getElementById('terminal'));
    //terminal.loadAddon(new CanvasAddon());
    //terminal.loadAddon(new WebLinksAddon());
    //terminal.loadAddon(new WebglAddon());
    term.prompt = 'Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ';
    prompt(term);

    term.onData(e => {
        console.log(term._core.buffer.x);
        switch (e) {
            case '\u0003': // Ctrl+C
                term.write('^C');
                prompt(term);
                break;
            case '\r': // Enter
                onEnter(term);
                term.command = '';
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
                console.log('tabbed', output, ["dd", "ls"]);
                break;
            default:
                if (e >= String.fromCharCode(0x20) && e <= String.fromCharCode(0x7E) || e >= '\u00a0') {
                    term.command += e;
                    term.write(e);
                }
        }
    });

    window.addEventListener('keydown', function (e) {
        console.log(e.key);
        // if (!(e.code in codeToKeyMap)) {
        //     console.log("key not supported");
        //     console.log(e);
        //     return;
        // }
        // var key = codeToKeyMap[e.code];
        // mouseEvent(key, e.type);
    });

    window.addEventListener('keyup', function (e) {
        // if (!(e.code in codeToKeyMap)) {
        //     console.log("key not supported");
        //     console.log(e);
        //     return;
        // }
        // var key = codeToKeyMap[e.code];
        // mouseEvent(key, e.type);
    });
};
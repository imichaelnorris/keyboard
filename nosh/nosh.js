import { File, Folder, Path } from "../filesystem/filesystem.js";

export const name = 'nosh';

export { Nosh }

var help = `
Nosh, version 0.0.1
These shell commands are defined externally on stone tablets which have been buried in
the Mojave Desert, but for your convenience we have also included them in this shell.
Type \`help' to see this list.
Type \`help name' to find out more about the function \`name'.
Use \`info mosh' to find out more about the shell in general.
Use \`man -k' or \`info' to find out more about commands not in this list.

I am using this as a list to track my re-implementation of bash.

A star (*) next to a name means that the command is disabled.

*job_spec [&]
 *(( expression ))
 *. filename [arguments] 
 *:
 *[ arg... ]
 *[[ expression ]]
 *alias [-p] [name[=value] ... ]
 *bg [job_spec ...] 
 *bind [-lpsvPSVX] [-m keymap] [-f filename]
 *break [n]
 *builtin [shell-builtin [arg ...]]
 *caller [expr]
 *case WORD in [PATTERN [| PATTERN]...) COMMANDS ;;]... esac
 cd [-L|[-P [-e]] [-@]] [dir]
 *compgen [-abcdefgjksuv] [-o option] [-A action] [-G globpat] [-W wordlist]
 *complete [-abcdefgjksuv] [-pr] [-DEI] [-o option] [-A action] [-G globpat]
 *compopt [-o|+o option] [-DEI] [name ...]
 *continue [n]
 *coproc [NAME] command [redirections]
 *declare [-aAfFgilnrtux] [-p] [name[=value] ...]
 *dirs [-clpv] [+N] [-N] 
 *echo [-neE] [arg ...]
 *eval [arg ...]
 *exec [-cl] [-a name] [command [arguments ...]] [redirection ...]
 *exit [n]
 *export [-fn] [name[=value] ...] or export -p
 *false
 *fc
 *fg [job_spec]
 *for NAME [in WORDS ... ] ; do COMMANDS; done
 *for (( exp1; exp2; exp3 )); do COMMANDS; done
 *function name { COMMANDS ; } or name () { COMMANDS ; }
 *getopts optstring name [arg]
 *hash [-lr] [-p pathname] [-dt] [name ...]
 help [-dms] [pattern ...]
 *history [-c] [-d offset] [n] or history -anrw [filename] or history -ps arg [arg...]
 *if COMMANDS; then COMMANDS; [ elif COMMANDS; then COMMANDS; ]... [ else COMMANDS; ] fi
 *jobs [-lnprs] [jobspec ...] or jobs -x command [args]
 *kill [-s sigspec | -n signum | -sigspec] pid | jobspec ... or kill -l [sigspec]
 *let arg [arg ...]
 *local [option] name[=value] ...
 *logout [n]
 *mapfile [-d delim] [-n count] [-O origin] [-s count] [-t] [-u fd] [-C callback]
 *popd [-n] [+N | -N]
 *printf [-v var] format [arguments]
 *pushd [-n] [+N | -N | dir]
 *pwd [-LP]
 *read [-ers] [-a array] [-d delim] [-i text] [-n nchars] [-N nchars]  -p prompt]
 *readarray [-d delim] [-n count] [-O origin] [-s count] [-t] [-u fd] [-C callback]
 *readonly [-aAf] [name[=value] ...] or readonly -p
 *return [n]
 *select NAME [in WORDS ... ;] do COMMANDS; done
 *set [-abefhkmnptuvxBCHP] [-o option-name] [--] [arg ...]
 *shift [n]
 *shopt [-pqsu] [-o] [optname ...]
 *source filename [arguments]
 *suspend [-f]
 *test [expr]
 *time [-p] pipeline
 *times
 *trap [-lp] [[arg] signal_spec ...]
 *true
 *type [-afptP] name [name ...]
 *typeset [-aAfFgilnrtux] [-p] name[=value] ...
 *ulimit [-SHabcdefiklmnpqrstuvxPT] [limit]
 *umask [-p] [-S] [mode]
 *unalias [-a] name [name ...]
 *unset [-f] [-v] [-n] [name ...]
 *until COMMANDS; do COMMANDS; done
 *variables - Names and meanings of some shell variables
 *wait [-fn] [id ...]
 *while COMMANDS; do COMMANDS; done
 *{ COMMANDS ; }`;

class Nosh {
    constructor(nterm) {
        this.nterm = nterm;
        this.cwd = null;
        this.variables = {};
        this.commands = {};

        this.installBuiltinCommands();
    }

    installBuiltinCommands() {
        this.commands = {
            ...this.commands,
            'cd': (args) => this.cd(args),
            'clear': (args) => this.clear(args),
            'date': (args) => this.date(args),
            'help': (args) => this.help(args),
            'ls': (args) => this.ls(args),
            'pwd': (args) => this.pwd(args),
            'shutdown': (args) => this.shutdown(args),
        }
    }

    processCmd(command) {
        var command = this.nterm.command.trim();
        if (command.length === 0) {
            this.nterm.term.write('\n\r');
            return new Promise((resolve) => { resolve(); });
        }
        var progArgs = command.split();
        var program = '';
        var args = [];
        if (progArgs.length >= 2) {
            args = progArgs.slice(1);
        }
        program = progArgs[0];
        if (!(program in this.commands)) {
            this.commandNotFound(program);
        } else {
            this.commands[program](args);
        }

        return new Promise((resolve) => { resolve(); });
    }

    commandNotFound(command) {
        this.nterm.term.writeln(`\r\nCommand '${command}' not found, did you mean:\r\n\r\n  Literally anything else?`)
    }

    onEnter() {
        var command = this.nterm.command.trim();

        this.processCmd(command).then(() => this.showPrompt());

        // this.nterm.term.writeln(`\n\r${command}`, () => this.showPrompt());
    }

    showPrompt() {
        this.nterm.resetCommand();
        this.nterm.term.write(this.nterm.prompt, () => {
            this.nterm.term.promptLength = this.nterm.term._core.buffer.x;
        });
    }

    // commands below, alphabetized

    shutdown(args) {
        var defaults = {};
        args = { ...defaults, ...args };
        this.nterm.term.write('\r\nShuting down in 3 2 1 ....', () => {
            // Shutdown NorrOS. Possibly go into a halted state and show
            // a button which can start it back up.
        });
    }

    cd(dir) {
        if (typeof (dir) === undefined || dir == '') {
            return this;
        }
        if (!window.norros.mkernel.filesystem.fileExists(dir)) {
            throw Error(`nosh: cd: ${dir}: No such file or directory.`)
        }
        this.cwd = dir;
        return this;
    }

    date() {
        this.nterm.term.writeln();
        this.nterm.term.writeln(new Date());
    }

    clear() {
        this.nterm.term.clear();
    }

    help() {
        this.nterm.term.write(help);
        return 0;
    }

    ls(arg) {
        if (typeof (arg) !== 'undefined' && typeof (arg) == 'String' && arg.length >= 1) {
            // Not absolute path.
            if (arg[0] != '/') {
                arg = Path.join(this.cwd, arg);
            }
        }
        var file = window.norros.mkernel.filesystem.getFile(this.cwd);
        if (file === null) {
            this.nterm.term.writeln('ls: cannot access ')
        }
        else if (file instanceof File) {
            this.nterm.term.writeln(`${file.name}`);
        }
        else if (file instanceof Folder) {
            var files = [];
            for (var file in file.files) {
                files.push(file);
            }
            console.log(files);
            this.nterm.term.writeln(files.join('\n'));
        }
        else {
            console.log(file);
            throw Error('ls: some kind of error occurred');
        }
    }

    pwd() {
        this.nterm.term.writeln(this.cwd);
    }

    static install() {
        var noshrc = "/home/user/.noshrc";
        var fileContents = "PS1='\[\0o33[01;32m\]{`date +\" % a % b % Y % H:% M:% S\"`\[\0o33[00m\] \[\0o33[01;34m\]{\w}}\[\0o33[00m\]\$ '";
        // then create this file.
        // TODO: add this once mkdir -p and create file are implemented.
    }
}

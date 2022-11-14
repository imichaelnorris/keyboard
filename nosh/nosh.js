export const name = 'nosh';

export { Nosh }

var help = `Nosh, version 0.0.1
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
    constructor() {
        this.cwd = null;
    }

    cd(dir) {
        if (!window.norros.mkernel.filesystem.fileExists(dir)) {
            throw Error(`nosh: cd: ${dir}: No such file or directory.`)
        }
        this.cwd = dir;
        return this;
    }

    help() {
        return help;
    }
}
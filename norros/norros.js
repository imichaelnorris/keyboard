import { File, Folder } from '../filesystem/filesystem.js'
import { MKernel } from '../mkernel/mkernel.js'
import { NTerm } from '../nterm/nterm.js'

class NorrOS {
    constructor() {

    }

    async boot() {
        this.mkernel = new MKernel();
        this.mkernel.filesystem.root.withFiles([
            new Folder("home").addFile(
                new Folder("user"),
            ),
            new Folder("usr").addFile(
                new Folder("bin"),
            )
        ]);
        return new Promise((resolve) => { resolve(); });
    }

    async startOS() {
        this.mkernel.start(new NTerm('div.terminal'));
        return new Promise((resolve) => { resolve(); });
    }
}


window.addEventListener('load', (evt) => {
    window.norros = new NorrOS();
    window.norros.boot().then(
        () => window.norros.startOS()
    );
});
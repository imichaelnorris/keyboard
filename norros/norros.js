import { MKernel } from '../mkernel/mkernel.js'
import { NTerm } from '../nterm/nterm.js'

class NorrOS {
    constructor() {

    }

    start() {
        this.mkernel = new MKernel();
        this.mkernel.start(new NTerm('div.terminal'));
        return this;
    }
}


window.addEventListener('load', (evt) => {
    window.norros = new NorrOS();
    window.norros.start();
});
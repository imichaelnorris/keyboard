export const name = 'filesystem';

export { FileSystem, File, Folder }

class FileSystem {
    constructor() {
        this.root = new Folder("/");
    }

    getFile(fileName) {

    }

    // Does the file exist? Supports a search starting
    fileExists(fileName, root) {
        if (typeof (root) === 'undefined') {
            root = this.root;
        }
        if (root === this.root) {
            if (fileName === "/") {
                return true;
            }
            fileName = fileName.substring(1);
        }
        if (typeof (root) === String) {
            throw Error("This should probably support a string as the root\
arg but it doesn't yet. Please pass a folder as the root arg.");
            // This would probably be implemented as this.getFile(root)
        }
        return this._fileExistsRecursive(fileName, this.root);
    }

    // Does string: file exist in Folder: root?
    _fileExistsRecursive(fileName, root, debug) {
        if (typeof (debug) !== 'undefined') {
            console.log(`fileExistsRecursive: ${fileName}`);
        }
        if (fileName in ["/", ".", ""]) {
            return true;
        }
        var numFolders = fileName.match(/\//g);
        if (numFolders == null) {
            return fileName in root.files;
        }
        var split = /\//.exec(fileName);
        var newFile = fileName.substring(0, split.index);

        // File not in this directory. It doesn't exist.
        if (!(newFile in root.files)) {
            return false;
        }

        // The file exists in this directory and it isn't a folder and the fileName has 
        // no more children.
        if (split == fileName.length) {
            return true;
        }

        var file = root.files[newFile];
        // If the file isn't a Folder then it won't have any children, but our
        // precondition above requires there to be a folder with some child in it.
        if (!(file instanceof Folder)) {
            return false;
        }

        var nextFile = fileName.substring(/\//.exec(fileName).index + 1);
        return this._fileExistsRecursive(nextFile, file);
    }
}

class Folder {
    constructor(name, parent) {
        this.name = name;
        if (name === "/") {
            if (typeof (parent) !== "undefined") {
                throw Error("Root directory can't have a parent!");
            }
            this.parent = null;
        } else {
            // Folder.throwIfNotFolder(parent);
            this.parent = parent;
        }
        this.files = {};
        this.lastUpdated = new Date();
    }

    static throwIfNotFolder(parent) {
        if (!(parent instanceof Folder)) {
            throw Error("File's parent must be a Folder!");
        }
    }


    addFile(file) {
        if (!(file instanceof File || file instanceof Folder)) {
            throw Error(`Folder.addFile. added: "${typeof (file)}" "${JSON.stringify(file)}"`);
        }
        file.parent = this;
        this.files[file.name] = file;
        return this;
    }

    withFiles(files) {
        for (const name in files) {
            this.addFile(files[name]);
        }
        return this;
    }
}

class File {
    constructor(name, contents, parent) {
        this.name = name;
        this.contents = contents;
        this.parent = parent;
        this.lastUpdated = new Date();
    }
}
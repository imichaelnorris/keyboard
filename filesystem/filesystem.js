export const name = 'filesystem';

export { FileSystem, File, Folder, Path }

class FileSystem {
    constructor() {
        this.root = new Folder("/");
    }

    // Returns the file if it exists, else returns null.
    getFile(fileName, root) {
        if (typeof (root) === 'undefined') {
            root = this.root;
        }
        if (root === this.root) {
            if (fileName === "/") {
                return root;
            }
            fileName = fileName.substring(1);
        }
        if (typeof (root) === String) {
            throw Error("This should probably support a string as the root\
arg but it doesn't yet. Please pass a folder as the root arg.");
            // This would probably be implemented as this.getFile(root)
        }
        return this._getFileRecursive(fileName, this.root);
    }

    // Does string: file exist in Folder: root?
    _getFileRecursive(fileName, root, debug) {
        if (typeof (debug) !== 'undefined') {
            console.log(`fileExistsRecursive: ${fileName}`);
        }
        if (fileName in ["/", ".", ""]) {
            return root;
        }
        var numFolders = fileName.match(/\//g);
        if (numFolders == null) {
            return fileName in root.files ? root.files[fileName] : null;
        }
        var split = /\//.exec(fileName);
        var newFile = fileName.substring(0, split.index);

        // File not in this directory. It doesn't exist.
        if (!(newFile in root.files)) {
            return null;
        }

        // The file exists in this directory and it isn't a folder and the fileName has 
        // no more children.
        if (split == fileName.length) {
            return root.files[newFile];
        }

        var file = root.files[newFile];

        var nextFile = fileName.substring(/\//.exec(fileName).index + 1);
        return this._getFileRecursive(nextFile, file, debug);
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
        return this._fileExistsRecursive(nextFile, file, debug);
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

class Path {
    static separator = '/';

    // TODO: imeplement this. Right now it's just joining together regardless.
    // Join parts of a path together. Similar to Python's os.path.join.
    // If part[i] and part[j] have or don't have a separator between them
    static join(...parts) {
        var t = '';
        for (var i = 0; i < parts; i++) {
            if (t.length == 0) {
                t += parts[i]
            } else {
                var tEndsInSeparator = t.substring(t.length - 1) == Path.separator;
                var partStartsInSeparator = parts[i].length > 0 && parts[i] == Path.separator;
                if (tEndsInSeparator ^ partStartsInSeparator) {
                    t += parts[i];
                } else if (tEndsInSeparator && partStartsInSeparator) {
                    t += parts[i].substring(1);
                } else {
                    t += Path.separator + parts[i];
                }
            }
        }
        return t;
    }
}
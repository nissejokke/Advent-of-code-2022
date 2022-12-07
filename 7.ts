import './helpers.ts';

let data = await Deno.readTextFile('7.txt');
// let data = `$ cd /
// $ ls
// dir a
// 14848514 b.txt
// 8504156 c.dat
// dir d
// $ cd a
// $ ls
// dir e
// 29116 f
// 2557 g
// 62596 h.lst
// $ cd e
// $ ls
// 584 i
// $ cd ..
// $ cd ..
// $ cd d
// $ ls
// 4060174 j
// 8033020 d.log
// 5626152 d.ext
// 7214296 k`;

interface File { name: string; size: number; isDirectory: boolean; }
let pwd: string[] = [];
const files: Record<string, File[]> = {};
for (const line of data.lines()) {
    const words = line.trim().split(' ');
    if (words[0] === '$') {
        const [,command, arg1] = words;
        if (command === 'cd') {
            if (arg1 === '/') pwd = [];
            else if (arg1 === '..') pwd.pop();
            else pwd.push(arg1);
        }
    }
    else {
        const [p1, p2] = words;
        const path = pwd.join('/');
        const filesInPath:File[] = files[path] || [];
        const isDirectory = p1 === 'dir';
        filesInPath.push({
            name: p2,
            size: isDirectory ? 0 : parseInt(p1),
            isDirectory,
        });
        files[path] = filesInPath;
    }
}

function getFilesForDir(dir: string): File[] {
    return Object.keys(files).filter(key => key === dir).map(key => files[key])[0];
}

function sizeOfDir(parent: File[], parentDirs: string): number {
    if (!parent?.length) return 0;
    const filesSize = parent.map(p => p.size).sum();
    const dirSizes = parent.filter(p => p.isDirectory).map(p => {
        let newParent = parentDirs + '/' + p.name;
        if (newParent.startsWith('/')) newParent = newParent.substring(1);
        const files = getFilesForDir(newParent);
        return sizeOfDir(files, newParent);
    });
    return filesSize + dirSizes.sum();
}

// part 1
const sum = Object.keys(files).map(file => {
    const size = sizeOfDir(files[file], file);
    return {file, size};
}).filter(file => file.size <= 100000).map(file => file.size).sum();
console.log(sum);

// part 2
const systemSize = 70000000;
const freeNeeded = 30000000;
const used = sizeOfDir(files[''], '');
const unused = systemSize - used;

const path = Object.keys(files).map(key => {
    const size = sizeOfDir(files[key], key);
    return { key, size };
}).filter(a => {
    return unused + a.size >= freeNeeded;
}).sort((a,b) => b.size - a.size).last();

console.log(path.size);

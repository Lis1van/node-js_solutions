const fs = require('fs');
const path = require('path');

const baseFolder = path.join(__dirname, 'baseFolder');

function createFolderStructure() {
    if (!fs.existsSync(baseFolder)) {
        fs.mkdirSync(baseFolder);
    }

    for (let i = 1; i <= 5; i++) {
        const folderPath = path.join(baseFolder, `folder${i}`);

        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
        }

        for (let j = 1; j <= 5; j++) {
            const filePath = path.join(folderPath, `file${j}.txt`);
            fs.writeFileSync(filePath, `This is file ${j} in folder ${i}`);
        }
    }
}

function printFolderContents(dir) {
    const items = fs.readdirSync(dir);

    items.forEach(item => {
        const itemPath = path.join(dir, item);
        const stats = fs.statSync(itemPath);

        if (stats.isDirectory()) {
            console.log(`${itemPath} - folder`);
            printFolderContents(itemPath);
        } else if (stats.isFile()) {
            console.log(`${itemPath} - file`);
        }
    });
}

createFolderStructure();

printFolderContents(baseFolder);

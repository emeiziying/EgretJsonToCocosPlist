const fs = require("fs");
const plist = require("plist");
var sizeOf = require('image-size');

if (process.argv.length < 3) {
    console.log("Please provide a egret json file!");
    process.exit();
}

const jsonFilePath = process.argv[2];

if (!fs.existsSync(jsonFilePath)) {
    console.log("Target json: %s not exist!", jsonFilePath);
    process.exit();
}

let imageFilePath = jsonFilePath.replace(".json", ".png");
var dimensions = sizeOf(imageFilePath);

const parsedJson = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));

let exportPlist = {};

let frames = {}
for (let key in parsedJson.frames) {
    let data = parsedJson.frames[key];
    // console.log(data);

    let frame = {};

    frame['aliases'] = [];
    frame['spriteOffset'] = '{' + data.offX + ',' + data.offY + '}';
    frame['spriteSize'] = '{' + data.w + ',' + data.h + '}';
    frame['spriteSourceSize'] = '{' + data.sourceW + ',' + data.sourceH + '}';
    frame['textureRect'] = '{' + '{' + data.x + ',' + data.y + '}' + ',' + '{' + data.w + ',' + data.h + '}}';
    frame['textureRotated'] = false;

    frames[key + '.png'] = frame
}

exportPlist['frames'] = frames;
exportPlist['metadata'] = {
    format: 3,
    pixelFormat: 'RGBA8888',
    premultiplyAlpha: false,
    realTextureFileName: parsedJson.file,
    size: '{' + dimensions.width + ',' + dimensions.height + '}',
    textureFileName: parsedJson.file
};

let exportString = plist.build(exportPlist);
let exportFilePath = jsonFilePath.replace(".json", ".plist");

fs.writeFileSync(exportFilePath, exportString, "utf8");

console.log("Cocos Plist file written to: %s.", exportFilePath);
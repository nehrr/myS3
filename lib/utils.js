import moment from 'moment';
import kleur from 'kleur';
import fs from 'fs';

export function mLog(str, c = 'magenta', withNewLine = true) {
  const display = kleur[c](`${moment().format()} - ${str}`);
  if (withNewLine) {
    console.log(display);
  } else {
    process.stdout.write(display);
  }
}

export function getExtension(filename) {
  const [extension] = filename.match(/\.[0-9a-z]+$/i);
  const name = filename.substr(0, filename.length - extension.length);
  return { name, extension };
}

export function deleteFolderRecursive(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach((file, index) => {
      const curPath = `${path}/${file}`;
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}

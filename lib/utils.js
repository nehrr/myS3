import moment from 'moment';
import kleur from 'kleur';
import path from 'path';

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

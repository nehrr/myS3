import fs from 'fs';
import path from 'path';
import { deleteFolderRecursive } from './utils';

class Filesystem {
  constructor() {
    this.BASE_PATH = '/opt/workspace/myS3';
    if (!Filesystem.instance) {
      Filesystem.instance = this;
      this.init();
    }

    return Filesystem.instance;
  }

  init() {
    if (!fs.existsSync('/opt/workspace')) {
      try {
        fs.mkdirSync('/opt/workspace');
        fs.chmodSync('/opt/workspace', '777');
      } catch (e) {
        console.log(e);
      }
    }

    if (!fs.existsSync('/opt/workspace/myS3')) {
      try {
        fs.mkdirSync('/opt/workspace/myS3');
        fs.chmodSync('/opt/workspace/myS3', '777');
      } catch (e) {
        console.log(e);
      }
    }
  }

  createUser(user) {
    if (!fs.existsSync(path.join(this.BASE_PATH, user))) {
      try {
        fs.mkdirSync(path.join(this.BASE_PATH, user));
        fs.chmodSync(path.join(this.BASE_PATH, user), '777');
      } catch (e) {
        console.log(e);
      }
    } else {
      throw new Error(`/opt/workspace/myS3/${user}/ already exists`);
    }
  }

  removeUser(user) {
    if (fs.existsSync(path.join(this.BASE_PATH, user))) {
      try {
        deleteFolderRecursive(path.join(this.BASE_PATH, user));
      } catch (e) {
        console.log(e);
      }
    } else {
      throw new Error(`/opt/workspace/myS3/${user}/ could not be removed`);
    }
  }

  createBucket(user, id) {
    if (!fs.existsSync(path.join(this.BASE_PATH, user, id.toString()))) {
      try {
        fs.mkdirSync(path.join(this.BASE_PATH, user, id.toString()));
        fs.chmodSync(path.join(this.BASE_PATH, user, id.toString()), '777');
      } catch (e) {
        console.log(e);
      }
    } else {
      throw new Error(`/opt/workspace/myS3/${user}/${id} already exists`);
    }
  }

  removeBucket(user, id) {
    if (fs.existsSync(path.join(this.BASE_PATH, user, id.toString()))) {
      try {
        deleteFolderRecursive(path.join(this.BASE_PATH, user, id.toString()));
      } catch (e) {
        console.log(e);
      }
    } else {
      throw new Error(`/opt/workspace/myS3/${user}/${id} could not be removed`);
    }
  }

  duplicateBlob(path, blob) {
    if (!fs.existsSync(path)) {
      throw new Error(`file ${path} does not exist`);
    }

    try {
      fs.createReadStream(path).pipe(fs.createWriteStream(blob));
    } catch (e) {
      throw new Error(`could not duplicate file ${path}, err: ${e}`);
    }
  }

  removeBlob(path) {
    if (!fs.existsSync(path)) {
      throw new Error(`file ${path} does not exist`);
    }

    try {
      fs.unlinkSync(path);
    } catch (e) {
      throw new Error(`could not remove file ${path}, err: ${e}`);
    }
  }
}

const instance = new Filesystem();
Object.freeze(instance);

export default instance;

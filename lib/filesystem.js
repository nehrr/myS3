import fs from 'fs';
import path from 'path';

class Filesystem {
  constructor() {
    this.BASE_PATH = '/opt/workspace/myS3';
    if (!Filesystem.instance) {
      Filesystem.instance = this;
      this.init();
    }
  }

  init() {
    if (!fs.existsSync(this.BASE_PATH)) {
      try {
        fs.mkdirSync(this.BASE_PATH);
        fs.chmodSync(this.BASE_PATH, '777');
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
    if (!fs.existsSync(path.join(this.BASE_PATH, user))) {
      try {
        fs.rmdirSync(path.join(this.BASE_PATH, user));
      } catch (e) {
        console.log(e);
      }
    } else {
      throw new Error(`/opt/workspace/myS3/${user}/ could not be removed`);
    }
  }

  createBucket(user, name) {
    if (!fs.existsSync(path.join(this.BASE_PATH, user, name))) {
      try {
        fs.mkdirSync(path.join(this.BASE_PATH, user, name));
        fs.chmodSync(path.join(this.BASE_PATH, user, name), '777');
      } catch (e) {
        console.log(e);
      }
    } else {
      throw new Error(`/opt/workspace/myS3/${user}/${name} already exists`);
    }
  }

  removeBucket(user, name) {
    if (!fs.existsSync(path.join(this.BASE_PATH, user, name))) {
      try {
        fs.rmdirSync(path.join(this.BASE_PATH, user, name));
      } catch (e) {
        console.log(e);
      }
    } else {
      throw new Error(`/opt/workspace/myS3/${user}/${name} could not be removed`);
    }
  }

  renameBucket(user, name, newName) {
    if (!fs.existsSync(path.join(this.BASE_PATH, user, name))) {
      try {
        fs.renameSync(
          path.join(this.BASE_PATH, user, name),
          path.join(this.BASE_PATH, user, newName),
        );
      } catch (e) {
        console.log(e);
      }
    } else {
      throw new Error(`/opt/workspace/myS3/${user}/${name} could not be renamed`);
    }
  }

  createBlob(user, bucket, name) {}

  removeBlob(user, bucket, name) {}

  renameBlob(user, bucket, name) {}
}

const instance = new Filesystem();
Object.freeze(instance);

export default instance;

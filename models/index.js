import Sequelize, { Op } from 'sequelize';
import dotenv from 'dotenv';
import User from './user';
import Bucket from './bucket';
import Blob from './blob';

dotenv.config();

export const db = new Sequelize(process.env.DATABASE_URL, {
  operatorsAliases: Op,
  define: {
    underscored: true,
  },
});

const modelUser = User.init(db, Sequelize);
const modelBlob = Blob.init(db, Sequelize);
const modelBucket = Bucket.init(db, Sequelize);

modelUser.hasMany(Bucket, { as: 'buckets', onDelete: 'cascade' });
modelBucket.belongsTo(User, { as: 'user' });
modelBucket.hasMany(Blob, { as: 'blobs', onDelete: 'cascade' });
modelBlob.belongsTo(Bucket, { as: 'bucket' });

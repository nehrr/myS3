import Sequelize from 'sequelize';
import dotenv from 'dotenv';
import User from './user';

dotenv.config();

export const db = new Sequelize(process.env.DATABASE_URL);
User.init(db, Sequelize);

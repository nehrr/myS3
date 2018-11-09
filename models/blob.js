import { Model } from 'sequelize';

export default class blob extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: { args: true, msg: 'blob already exists' },
        },
        path: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: { args: true, msg: 'blob already exists' },
        },
        size: {
          type: DataTypes.STRING,
        },
      },

      {
        sequelize,
      },
    );
  }
}

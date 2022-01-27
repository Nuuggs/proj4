import { Sequelize } from 'sequelize';

export default function initMatchModel(sequelize, DataTypes) {
  return sequelize.define('match', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    p1Id: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    p2Id: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    parameters: {
      allowNull: false,
      type: DataTypes.JSONB,
    },
    searchResults: {
      type: DataTypes.JSONB,
    },
    timeExpiry: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP + INTERVAL \'1d\''),
    },
    likesList: {
      type: DataTypes.JSONB,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  }, {
    // The underscored option makes Sequelize reference snake_case names in the DB.
    underscored: true,
  });
}

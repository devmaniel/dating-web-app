const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Profile = require('./Profile_Sequelize');

const MatchingPrefs = sequelize.define(
  'MatchingPrefs',
  {
    user_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: {
        model: Profile,
        key: 'user_id',
      },
      onDelete: 'CASCADE',
    },
    open_for_everyone: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    gender_preferences: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Array of gender enum values',
    },
    purpose_preference: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Array of purpose enum values (1..3)',
    },
    distance_min_km: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    distance_max_km: {
      type: DataTypes.INTEGER,
      defaultValue: 100,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'matching_prefs',
    timestamps: false,
    underscored: true,
  }
);

// Association
MatchingPrefs.belongsTo(Profile, { foreignKey: 'user_id' });
Profile.hasOne(MatchingPrefs, { foreignKey: 'user_id' });

module.exports = MatchingPrefs;

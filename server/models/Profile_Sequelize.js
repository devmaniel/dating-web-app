const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const User = require('./User_Sequelize');

const Profile = sequelize.define(
  'Profile',
  {
    user_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: {
        model: User,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    middle_name: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'nonbinary'),
      allowNull: true,
    },
    birthdate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    school: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    program: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    about_me: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    looking_for: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    interests: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    music: {
      type: DataTypes.JSON,
      allowNull: true,
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
    tableName: 'profiles',
    timestamps: false,
    underscored: true,
  }
);

// Association
Profile.belongsTo(User, { foreignKey: 'user_id' });
User.hasOne(Profile, { foreignKey: 'user_id' });

module.exports = Profile;

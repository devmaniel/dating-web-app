const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Profile = require('./Profile_Sequelize');

/**
 * UserPhoto Model - Stores profile picture and cover picture
 * Each user can have at most one profile_picture and one cover_picture
 */
const UserPhoto = sequelize.define(
  'UserPhoto',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Profile,
        key: 'user_id',
      },
      onDelete: 'CASCADE',
    },
    type: {
      type: DataTypes.ENUM('profile_picture', 'cover_picture'),
      allowNull: false,
    },
    img_link: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'AWS S3 URL for displaying the image (NULL until S3 integration)',
    },
    img_file_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Original file name of the uploaded image',
    },
    s3_key: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'S3 object key for deletion and management (NULL until S3 integration)',
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'File size in bytes',
    },
    mimetype: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'MIME type of the photo (e.g., image/jpeg)',
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
    tableName: 'user_photos',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'type'],
        comment: 'Ensures only one profile_picture and one cover_picture per user',
      },
    ],
  }
);

// Association
UserPhoto.belongsTo(Profile, { foreignKey: 'user_id' });
Profile.hasMany(UserPhoto, { foreignKey: 'user_id' });

module.exports = UserPhoto;

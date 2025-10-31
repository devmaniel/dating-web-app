const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Profile = require('./Profile_Sequelize');

/**
 * UserAlbum Model - Stores album photos for users
 * Each user can have up to 6 album photos
 * Position field maintains the order of photos (1-6)
 */
const UserAlbum = sequelize.define(
  'UserAlbum',
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
    position: {
      type: DataTypes.INTEGER,
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
    tableName: 'user_albums',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'position'],
        comment: 'Ensures unique position for each user album',
      },
    ],
  }
);

// Association
UserAlbum.belongsTo(Profile, { foreignKey: 'user_id' });
Profile.hasMany(UserAlbum, { foreignKey: 'user_id' });

module.exports = UserAlbum;

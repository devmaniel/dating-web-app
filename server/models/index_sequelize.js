const sequelize = require('../config/sequelize');
const User = require('./User_Sequelize');
const Profile = require('./Profile_Sequelize');
const MatchingPrefs = require('./MatchingPrefs_Sequelize');
const UserPhoto = require('./UserPhoto_Sequelize');
const UserAlbum = require('./UserAlbum_Sequelize');
const LikedYou = require('./LikedYou_Sequelize');
const Conversation = require('./Conversation_Sequelize');
const Message = require('./Message_Sequelize');
const Notification = require('./Notification_Sequelize');

// Initialize all models
const models = {
  sequelize,
  User,
  Profile,
  MatchingPrefs,
  UserPhoto,
  UserAlbum,
  LikedYou,
  Conversation,
  Message,
  Notification,
};

// Setup associations
if (LikedYou.associate) {
  LikedYou.associate(models);
}
if (Conversation.associate) {
  Conversation.associate(models);
}
if (Message.associate) {
  Message.associate(models);
}
if (Notification.associate) {
  Notification.associate(models);
}

// User associations for photos
User.hasMany(UserPhoto, { foreignKey: 'user_id', as: 'UserPhotos' });
User.hasMany(UserAlbum, { foreignKey: 'user_id', as: 'UserAlbums' });
UserPhoto.belongsTo(User, { foreignKey: 'user_id' });
UserAlbum.belongsTo(User, { foreignKey: 'user_id' });

module.exports = models;

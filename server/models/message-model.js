import Sequelize from 'sequelize';
import db from './_db';
const User = db.model('user');

class Message extends Sequelize.Model {}
Message.init({
  
}, { sequelize : db, modelName: 'message' });

export default Message;

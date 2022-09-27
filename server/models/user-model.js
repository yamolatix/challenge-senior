import Sequelize from 'sequelize';
import db from './_db';

class User extends Sequelize.Model {}
User.init({
 
}, { sequelize : db, modelName: 'user' });

export default User;

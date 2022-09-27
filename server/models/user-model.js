import Sequelize from 'sequelize';
import db from './_db';

class User extends Sequelize.Model { };

User.init({
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    }
}, { sequelize: db, modelName: 'user' });

export default User;

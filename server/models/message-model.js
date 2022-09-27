import Sequelize from 'sequelize';
import db from './_db';
const User = db.model('user');

class Message extends Sequelize.Model { }

Message.init({
    subject: {
        type: Sequelize.STRING,
        defaultValue: "No Subject",
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false,
    }
}, { sequelize: db, modelName: 'message' });

Message.getAllWhereSender = (fromId) => {
    return Message.findAll({
        where: { fromId },
        include: [
            { model: User, as: "from" },
            { model: User, as: "to" }
        ]
    })
};
Message.getAllWhereReceiver = function (userId) {
    return this.findAll({
        include: [{
            model: User,
            as: 'to',
            where: {
                id: userId
            }
        }, {
            model: User,
            as: 'from',
        }]
    });
}

Message.prototype.truncateSubject = function (num, trueDots) {
    this.subject = this.subject.slice(0, num) + (trueDots ? "..." : "");
    return this
}
export default Message;
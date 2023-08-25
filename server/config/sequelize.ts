import { Sequelize } from 'sequelize'

const sequelize = new Sequelize('remind_mme', process.env.MYSQL_USER!, process.env.MYSQL_PASSWORD!, {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql'
})

export = sequelize
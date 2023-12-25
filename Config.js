const knex = require('knex')

const db = knex({
    client: 'mysql',
    connection: {
        host: 'localhost',
        user: process.env.DB_USERNAME,
        password: '',
        database: process.env.DB_NAME
    }
});

module.exports = db
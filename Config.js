const knex = require('knex')

const db = knex({
    client: 'mysql',
    connection: {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'express'
    }
});

module.exports = db
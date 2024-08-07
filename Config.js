const knex = require('knex')

console.log('Connecting to the database' + process.env.DB_HOST);
const db = knex({
    client: 'mysql',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    }
});

module.exports = db
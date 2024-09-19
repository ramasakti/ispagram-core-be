const knex = require('knex')

const databases = {
    smpe2861_ispagram: {
        client: 'mysql2',
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_PROD,
        },
        pool: {
            min: 2,
            max: 10
        }
    },
    smas5845_ispagram: {
        client: 'mysql2',
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_PROD,
        },
        pool: {
            min: 2,
            max: 100
        }
    },
    // Tambahkan konfigurasi database lain di sini
}

const knexInstances = {}

const getDatabaseConnection = (dbID) => {
    if (!databases[dbID]) throw new Error(`Database configuration for ID '${dbID}' not found`)

    if (!knexInstances[dbID]) knexInstances[dbID] = knex(databases[dbID])
    
    return knexInstances[dbID]
}

const testDatabaseConnection = async (dbID) => {
    try {
        const db = getDatabaseConnection(dbID)
        await db.raw('SHOW TABLES')
        return true
    } catch (error) {
        console.error(`Failed to connect to database '${dbID}':`, error.message)
        return false
    }
}

module.exports = { getDatabaseConnection, testDatabaseConnection, databases }
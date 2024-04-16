/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('whatsapp', function (table) {
        table.increments('id_whatsapp').primary();
        table.string('nomor');
        table.string('token');
        table.string('name');
        table.boolean('connected').defaultTo(false);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('whatsapp');
};

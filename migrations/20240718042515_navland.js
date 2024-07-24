/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('navland', function (table) {
        table.increments('id_navland').primary();
        table.string('name');
        table.string('url');
        table.integer('order');
        table.boolean('active').defaultTo(true);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('navland');
};

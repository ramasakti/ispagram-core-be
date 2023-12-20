/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('navbar', function (table) {
        table.increments('id_navbar');
        table.integer('menu_id').unsigned();
        table.integer('role_id').unsigned();
        table.foreign('menu_id').references('id_menu').inTable('menu');
        table.foreign('role_id').references('id_role').inTable('role');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('navbar');
};

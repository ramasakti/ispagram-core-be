/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('access', function (table) {
        table.increments('id_access').primary();
        table.integer('permission_id').unsigned();
        table.integer('menu_id').unsigned();
        table.integer('role_id').unsigned();

        table.foreign('permission_id').references('id_permission').inTable('permission').onDelete('cascade').onUpdate('cascade');
        table.foreign('menu_id').references('id_menu').inTable('menu').onDelete('cascade').onUpdate('cascade');
        table.foreign('role_id').references('id_role').inTable('role').onDelete('cascade').onUpdate('cascade');
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('access');
};

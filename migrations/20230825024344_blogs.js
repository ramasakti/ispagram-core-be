/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('blog', function (table) {
        table.increments('id_blog').primary();
        table.string('slug');
        table.text('foto', 'longtext');
        table.string('judul');
        table.text('isi');
        table.dateTime('uploaded');
        table.string('uploader');
        table.boolean('publish');

        table.foreign('uploader').references('username').inTable('users');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('blog');
};

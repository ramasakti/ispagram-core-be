/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    knex.schema.createTable('blog', function (table) {
        table.increments('id_blog').primary();
        table.string('slug');
        table.text('foto', 'longtext');
        table.string('judul');
        table.text('isi');
        table.dateTime('uploaded');
        table.string('uploader');
        table.boolean('publish');
    })

    knex.schema.table('blog', function (table) {
        table.foreign('uploader').references('username').inTable('user');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    knex.schema.dropTableIfExists('blog');
};

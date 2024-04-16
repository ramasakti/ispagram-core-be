/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('detail_siswa', function (table) {
        table.string('id_siswa').primary();
        table.string('nama_siswa');
        table.text('telp').nullable();
        table.string('alamat');
        table.string('tempat_lahir');
        table.date('tanggal_lahir').nullable();
        table.string('nisn').nullable();
        table.string('nik').nullable();
        table.string('nokk').nullable();
        table.text('scan_kk', 'longtext').nullable();
        table.string('transportasi', 2).nullable();
        table.string('anak', 2).nullable();
        table.string('jenis_tinggal', 2).nullable();
        table.string('askol').nullable();
        table.text('scan_ijazah', 'longtext').nullable();
        table.string('ibu').nullable();
        table.string('nik_ibu').nullable();
        table.string('pendidikan_ibu').nullable();
        table.string('profesi_ibu', 2).nullable();
        table.string('penghasilan_ibu').nullable();
        table.string('telp_ibu').nullable();
        table.string('ayah').nullable();
        table.string('nik_ayah').nullable();
        table.string('pendidikan_ayah').nullable();
        table.string('profesi_ayah', 2).nullable();
        table.string('penghasilan_ayah').nullable();
        table.string('telp_ayah').nullable();
        table.integer('tinggi').nullable();
        table.integer('berat').nullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('detail_siswa');
};

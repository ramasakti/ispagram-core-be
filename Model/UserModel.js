const db = require('../Config')

const getAllUsers = async (trx = db) => await trx('users').join('role', 'role.id_role', '=', 'users.role')

const getAllUsersWithRole = async (trx = db) => {
    return await trx('users')
        .select(
            'users.username',
            'users.email',
            'users.avatar',
            'role.role',
            'role.id_role',
            db.raw('CASE WHEN guru.id_guru IS NOT NULL THEN guru.nama_guru ELSE detail_siswa.nama_siswa END AS name')
        )
        .join('role', 'role.id_role', '=', 'users.role')
        .leftJoin('guru', 'guru.id_guru', '=', 'users.username')
        .leftJoin('detail_siswa', 'detail_siswa.id_siswa', '=', 'users.username')

}

const getUserWithRoleByUsername = async (username, trx = db) => {
    return await trx('users')
        .select(
            'users.username',
            'users.email',
            'users.avatar',
            'users.password',
            'role.id_role',
            'role.role',
            db.raw('CASE WHEN guru.id_guru IS NOT NULL THEN guru.nama_guru ELSE detail_siswa.nama_siswa END AS name')
        )
        .join('role', 'role.id_role', '=', 'users.role')
        .leftJoin('guru', 'guru.id_guru', '=', 'users.username')
        .leftJoin('detail_siswa', 'detail_siswa.id_siswa', '=', 'users.username')
        .where('users.username', username)
        .first()
}

const getUserWithRoleByEmail = async (email, trx = db) => {
    return await trx('users')
        .select(
            'users.username',
            'users.email',
            'users.avatar',
            'users.password',
            'role.id_role',
            'role.role',
            db.raw('CASE WHEN guru.id_guru IS NOT NULL THEN guru.nama_guru ELSE detail_siswa.nama_siswa END AS name')
        )
        .join('role', 'role.id_role', '=', 'users.role')
        .leftJoin('guru', 'guru.id_guru', '=', 'users.username')
        .leftJoin('detail_siswa', 'detail_siswa.id_siswa', '=', 'users.username')
        .where('users.email', email)
        .first()
}

const getAllUsersWithGuru = async (trx = db) => {
    return await trx('users')
        .join('role', 'role.id_role', '=', 'users.role')
        .join('guru', 'guru.id_guru', '=', 'users.username')
}

const getUserByUsername = async (username, trx = db) => {
    return await trx('users')
        .join('role', 'role.id_role', '=', 'users.role')
        .where('users.username', username)
        .first()
}

const getUserByEmail = async (email, trx = db) => {
    return await trx('users')
        .join('role', 'role.id_role', '=', 'users.role')
        .where('users.email', email)
        .first()
}

const getUserWithGuruByUsername = async (username, trx = db) => {
    return await trx('users')
        .join('role', 'role.id_role', '=', 'users.role')
        .join('guru', 'guru.id_guru', '=', 'users.username')
        .where('users.username', username)
        .first()
}

const getUserWithGuruByEmail = async (email, trx = db) => {
    return await trx('users')
        .join('role', 'role.id_role', '=', 'users.role')
        .join('guru', 'guru.id_guru', '=', 'users.username')
        .where('users.email', email)
        .first()
}

const getAllUsersWithSiswa = async (trx = db) => {
    return await trx('users')
        .join('role', 'role.id_role', '=', 'users.role')
        .join('siswa', 'siswa.id_siswa', '=', 'users.username')
}

const updateUserAvatarByUsername = async (username, avatar, trx = db) => await trx('users').where('username', username).update({ avatar })

const updateUserPasswordByUsername = async (username, password, trx = db) => await trx('users').where('username', username).update({ password })

const updateUserPasswordByEmail = async (email, password, trx = db) => await trx('users').where('email', email).update({ password })

const updateUserByUsername = async (username, req, trx = db) => await trx('users').where('username', username).update(req)

const insertUser = async (req, trx = db) => await trx('users').insert(req)

const deleteUserByUsername = async (username, trx = db) => await trx('users').where('username', username).del()

const addFaceByUsername = async (username, face, trx = db) => await trx('users').where('username', username).update({ face })

module.exports = {
    getAllUsers,
    getAllUsersWithRole,
    getUserWithRoleByUsername,
    getUserWithRoleByEmail,
    getUserByUsername,
    getUserByEmail,
    getAllUsersWithGuru,
    getAllUsersWithSiswa,
    getUserWithGuruByUsername,
    getUserWithGuruByEmail,
    updateUserAvatarByUsername,
    updateUserPasswordByUsername,
    updateUserPasswordByEmail,
    updateUserByUsername,
    insertUser,
    deleteUserByUsername,
    addFaceByUsername
};

const db = require('../Config')

const getAllUsers = async () => {
    return await db('users').join('role', 'role.id_role', '=', 'users.role')
}

const getAllUsersWithRole = async () => {
    return await db('users')
        .select(
            'users.username',
            'users.email',
            'users.avatar',
            'role.role',
            db.raw('CASE WHEN guru.id_guru IS NOT NULL THEN guru.nama_guru ELSE siswa.nama_siswa END AS name')
        )
        .join('role', 'role.id_role', '=', 'users.role')
        .leftJoin('guru', 'guru.id_guru', '=', 'users.username')
        .leftJoin('siswa', 'siswa.id_siswa', '=', 'users.username')

}

const getAllUsersWithGuru = async () => {
    return await db('users')
        .join('role', 'role.id_role', '=', 'users.role')
        .join('guru', 'guru.id_guru', '=', 'users.username')
}

const getUserByUsername = async (username) => {
    return await db('users')
        .join('role', 'role.id_role', '=', 'users.role')
        .where('username', username)
        .first()
}

const getUserByEmail = async (email) => {
    return await db('users')
        .join('role', 'role.id_role', '=', 'users.role')
        .where('email', email)
        .first()
}

const getUserWithGuruByUsername = async (username) => {
    return await db('users')
        .join('role', 'role.id_role', '=', 'users.role')
        .join('guru', 'guru.id_guru', '=', 'users.username')
        .where('users.username', username)
        .first()
}

const getUserWithGuruByEmail = async (email) => {
    return await db('users')
        .join('role', 'role.id_role', '=', 'users.role')
        .join('guru', 'guru.id_guru', '=', 'users.username')
        .where('users.email', email)
        .first()
}

const getAllUsersWithSiswa = async () => {
    return await db('users')
        .join('role', 'role.id_role', '=', 'users.role')
        .join('siswa', 'siswa.id_siswa', '=', 'users.username')
}

const updateUserAvatarByUsername = async (username, avatar) => {
    return await db('users')
        .where('username', username)
        .update({ avatar })
}

const updateUserPasswordByUsername = async (username, password) => {
    return await db('users')
        .where('username', username)
        .update({ password })
}

const updateUserPasswordByEmail = async (email, password) => {
    return await db('users')
        .where('email', email)
        .update({ password })
}

const updateUserByUsername = async (username, req) => {
    return await db('users')
        .where('username', username)
        .update(req)
}

const insertUser = async (req) => {
    return await db('users').insert(req)
}

const deleteUserByUsername = async (username) => {
    return await db('users')
        .where('username', username)
        .del()
}

module.exports = {
    getAllUsers,
    getAllUsersWithRole,
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
    deleteUserByUsername
};

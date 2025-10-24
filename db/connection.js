const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'satashi3',
    database: 'login_app',
    connectionLimit: 5
});

module.exports = pool;
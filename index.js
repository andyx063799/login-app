const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const pool = require('./db/connection');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.use(session({
    secret: 'clave-secreta',
    resave: false,
    saveUninitialized: true
}));

// - Ruta para el registro
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const hash = await bcrypt.hash(password, 10);
        const conn = await pool.getConnection();
        await conn.query("INSERT into users (username, password) VALUES (?, ?)", [username, hash]);
        conn.release();
        res.json({ success: true, message: 'Usuario registrado correctamente' });
    } catch(err) {
        res.json({ success: false, message: 'Error al registrar (Puede ser que el usuario ya existe)' });
    }
});

// - Ruta para el login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM users WHERE username = ?", [username]);
        conn.release();

        if (rows.length > 0 && await bcrypt.compare(password, rows[0].password)) {
            req.session.user = username;
            return res.json({ success: true, message: 'Login correcto' });
        }

        res.json({ success: false, message: 'Usuario o contraseña incorrecta' });
    } catch(err) {
        res.json({ success: false, message: 'Error en el login' });
    }
});

// - Ahora para comprobar la sesion
app.get('/session', (req, res) => {
    if (req.session.user) {
        res.json({ logged: true, user: req.session.user });
    } else {
        res.json({ logged: false });
    }
});

// - Logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true, message: 'Sesion cerrada' });
});

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
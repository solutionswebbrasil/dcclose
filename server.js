const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Configurar o body-parser
app.use(bodyParser.json());

// Conectar ao banco de dados SQLite
let db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Conectado ao banco de dados SQLite em memória.');
});

// Criar a tabela de projetos
db.run(`CREATE TABLE projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// Endpoint para salvar um projeto
app.post('/save', (req, res) => {
    const data = JSON.stringify(req.body);
    db.run(`INSERT INTO projects (data) VALUES (?)`, [data], function(err) {
        if (err) {
            return console.error(err.message);
        }
        res.send({ id: this.lastID });
    });
});

// Endpoint para listar projetos salvos
app.get('/projects', (req, res) => {
    db.all(`SELECT id, timestamp FROM projects`, [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json(rows);
    });
});

// Endpoint para abrir um projeto específico
app.get('/project/:id', (req, res) => {
    const id = req.params.id;
    db.get(`SELECT data FROM projects WHERE id = ?`, [id], (err, row) => {
        if (err) {
            return console.error(err.message);
        }
        res.json(JSON.parse(row.data));
    });
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

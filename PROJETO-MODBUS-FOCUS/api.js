const express = require('express');
const {exec} = require('child_process');
const app = express();
const port = 3000;

// Endpoint para receber o request via GET com os dados mais recentes
app.get('/dados', (req, res) => {
    exec('node index.js', (error, stdout, stderr) => {
        if (error) {
            console.error(`Erro ao executar o arquivo index.js: ${error.message}`);
            return res.status(500).json({ error: 'ERRO ao executar o arquivo index.js' });
        }
        if (stderr) {
            console.error(`Erro ao executar o arquivo index.js: ${stderr}`);
            console.error(stderr); 
            return res.status(500).json({ error: 'ERRO ao executar o arquivo index.js' });
        }

        const jsonData = JSON.parse(stdout);
        return res.json(jsonData);
    });
});


app.listen(port, () => {
    console.log('servidor rodando http://localhost:3000/dados ');
})
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

// 创建 Express 应用
const app = express();
const port = 3000;

// 允许跨域请求
app.use(cors());
app.use(bodyParser.json());

// 创建 MySQL 连接
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',        // 使用你自己的 MySQL 用户
    password: '',        // 使用你自己的密码
    database: 'todos_db' // 确保你已经创建了这个数据库
});

// 连接数据库
db.connect((err) => {
    if (err) {
        console.error('数据库连接失败', err);
        return;
    }
    console.log('数据库已连接');
});

// 获取所有待办事项
app.get('/api/todos', (req, res) => {
    db.query('SELECT * FROM todos', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// 添加新的待办事项
app.post('/api/todos', (req, res) => {
    const { text, completed } = req.body;
    db.query('INSERT INTO todos (text, completed) VALUES (?, ?)', [text, completed], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: result.insertId, text, completed });
    });
});

// 删除待办事项
app.delete('/api/todos/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM todos WHERE id = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).send();
    });
});

// 更新待办事项
app.put('/api/todos/:id', (req, res) => {
    const { id } = req.params;
    const { text, completed } = req.body;
    db.query('UPDATE todos SET text = ?, completed = ? WHERE id = ?', [text, completed, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ id, text, completed });  // 返回更新后的数据
    });
});


// 启动服务器
app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
});

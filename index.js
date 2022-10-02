import express from "express"
import bodyParser from "body-parser"
import sqlite3 from "sqlite3";
const app = express()

app.use(bodyParser.json())


const db = new sqlite3.Database('data.db');
db.run("CREATE TABLE IF NOT EXISTS workers (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT VARCHAR(255) NOT NULL, surname TEXT VARCHAR(255) NOT NULL, salary INTEGER NOT NULL)");


// CREATE
app.post("/workers", bodyParser.json(), (req, res) => {
    let name = req.body["name"]
    let surname = req.body["surname"]
    let salary = req.body["salary"]
    db.run("INSERT INTO workers( name,surname, salary) VALUES(?,?,?)", name, surname, salary)
    res.send(JSON.stringify({ massage: "a new workers has been added" }));
})
//Օverall READ
app.get("/workers", bodyParser.json(), (req, res, next) => {
    db.all("SELECT * FROM workers", [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.status(200).json(rows);
    });
});

-
app.get("/workers/:id", bodyParser.json(), (req, res) => {
    db.get(`SELECT * FROM workers where id = ?`, [req.params.id], (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.status(200).json(row);
    });
});

// UPDATE
app.patch("/workers/:id", bodyParser.json(), (req, res) => {
    db.run(`UPDATE workers set name = ?, surname = ?, salary = ? WHERE id = ?`,
        [req.body.name, req.body.surname, req.body.salary, req.params.id],
        function (err, result) {
            if (err) {
                res.status(400).json({ "error": res.message })
                return;
            }
            res.status(200).json({ updatedID: this.changes });
        });
});

// DELETE
app.delete("/workers/:id", bodyParser.json(), (req, res) => {
    db.run(`DELETE FROM workers WHERE id = ?`,
        req.params.id,
        function (err, result) {
            if (err) {
                res.status(400).json({ "error": res.message })
                return;
            }
            res.status(200).json({ deletedID: this.changes })
        });
});




app.listen(3003, function () {
    console.log("hey you");
})
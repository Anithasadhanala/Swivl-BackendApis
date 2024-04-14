const express = require('express')
const app = express();
const Database = require("./dbConnection")
const configurationData = require("./configurationData")


const db = new Database(configurationData)

app.get('/',(req,res)=>{
    db.myQuery('SELECT * from users', [], (err, data) => {
        if (err) {
        console.error('Error connecting to database:', err);
        } else {
        console.log('Connected to database! Result:', data);
        res.send(data)
        }
    });
});


app.listen(4000, ()=>{
    console.log("I am ready at 4000...")
})
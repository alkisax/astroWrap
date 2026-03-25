import { Client } from "pg";
import express from 'express'

const app = express()
app.use(express.json())

const con = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "***",
  database: "demopost",
});

con.connect().then(() => console.log("connected"));

con.query("select * from demotable", (err, res) => {
  if (!err) {
    console.log(res.rows);
  } else {
    console.log(err.message);
  }
  con.end;
});

app.post ('/postData', (req, res) => {
  const {name, id} = req.body
  const insert_query = 'INSERT INTO demotable (name, id) VALUES ($1,$2)'
  con.query(insert_query, [name,id], (err, result) => {
    if (err) {
      res.send(err)
    } else {
      console.log(result);
      
      res.send("Posted data")
    }
  })
})

app.listen(3000, () => {
  console.log("server is up");
  
})
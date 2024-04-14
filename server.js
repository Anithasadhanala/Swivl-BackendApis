const express = require('express')
const {v4 : uuidv4} = require('uuid')
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();
const Database = require("./dbConnection")
const configurationData = require("./configurationData")


app.use(bodyParser.json());

const db = new Database(configurationData)

const authentication = (req, res, next) => {
    let jwtToken;
    const authHeader = req.headers["authorization"];
    if (authHeader !== undefined) {
      jwtToken = authHeader.split(" ")[1];
    }
    if (jwtToken === undefined) {
      res.status(401);
      res.send("Invalid JWT Token");
    } else {
      jwt.verify(jwtToken, "SECRET", async (error, payload) => {
        if (error) {
          res.status(401);
          res.send("Invalid JWT Token");
        } else {
          next();
        }
      });
    }
  };

class User {

    constructor(userName, email, userPassword,gender,location,phone) {
        this.userName = userName;
        this.email = email;
        this.userPassword = userPassword;
        this.gender = gender;
        this.location = location;
        this.phone = phone;
    }

    async userExists(userName) {
        console.log(userName);
        try {
            let sql = "SELECT * FROM users WHERE userName=?";
            const data = await new Promise((resolve, reject) => {
                db.myQuery(sql, [userName], (err, data) => {
                    if (err) reject(err);
                    else resolve(data);
                });
            });
            console.log(data)
            return data;
        }
        catch (error) {
            return error;
        }
    }


    async registerUser(details){

        const {userName, email, userPassword, gender, location, phone} = details;
        if(  (await this.userExists(userName)).length == 1){
            return "User Already Exists.";
        }
        try {
            const hashedPassword = await bcrypt.hash(userPassword, 10);
            const sql = "INSERT INTO users (id, userName, phone, email, gender, location, userPassword) VALUES (?,?,?,?,?,?,?) ;";
            const id = uuidv4();
            const data = await new Promise((resolve, reject) => {
                db.myQuery(sql, [id,userName,phone,email, gender, location, hashedPassword], (err, data) => {
                    if (err) reject(err);
                    else resolve("successfully user inserted");
                });
            });
            return data;
        }
        catch (error) {
            return error;
        }
    }



    async loginUser(details){
        
        const { userName,userPassword} = details;
        const isUserExists = await this.userExists(userName);

        if(isUserExists.length == 1){
            const registerdPassword = isUserExists[0].userPassword;
            const isPasswordMatched = await bcrypt.compare(userPassword, registerdPassword);
            if (isPasswordMatched === true) {
                const payload = {
                    userName: userName,
                };
                const jwtToken = jwt.sign(payload, "SECRET");
                return ({ jwtToken });
            } else {
            return  "Invalid Password"
            }
        }
        return "user doesn't exists."
    };

  
 
    async updateUserProfile(details) {
        const { userName , userPassword,location,email,phone,gender , id } = details;

        try {
            const sql = `UPDATE users SET userName = IFNULL(?, userName),userPassword = IFNULL(?, userPassword), gender = IFNULL(?, gender),phone = IFNULL(?, phone), location = IFNULL(?, location),email = IFNULL(?, email) WHERE id = ?`;
            const data = await new Promise((resolve, reject) => {
                db.myQuery(sql, [userName,userPassword,gender,phone,location,email, id], (err, data) => {
                    if (err) {
                        console.error(err); // Log the error for debugging
                        reject(err);
                    } else {
                        resolve("User data successfully updated");
                    }
                });
            });

            return data;
        } catch (error) {
            console.error(error); // Log any catched errors for debugging
            return error;
        }
    }


    async deleteUser(details) {
        const { userName} = details;

        try {
            const sql = "DELETE FROM users WHERE userName = ?;"        ;
            const data = await new Promise((resolve, reject) => {
                db.myQuery(sql, [userName], (err, data) => {
                    if (err) {
                        console.error(err); // Log the error for debugging
                        reject(err);
                    } else {
                        resolve("User Deleted Successfully");
                    }
                });
            });
            return data;
        } catch (error) {
            console.error(error); // Log any catched errors for debugging
            return error;
        }
    }
}





app.get('/user',async(req,res)=>{
   const obj = new User();
   const details = req.body;
   const {userName} = details;
   const result = await obj.userExists(userName)
   res.send(result)
});


app.post('/register',async(req,res)=>{
    const obj = new User();
    const details = req.body;
    const {userName} = details;
    const result = await obj.registerUser(details)
    res.send(result)
 });

 app.post('/login',async(req,res)=>{
    const obj = new User();
    const details = req.body;
    const result = await obj.loginUser(details);
    res.send(result);
 })

 app.put('/profile-update',authentication,async(req,res)=>{
    const obj = new User();
    console.log(req.body)
    const details = req.body;
    const result = await obj.updateUserProfile(details);
    res.send(result);
 })

 app.delete('/delete-user',authentication,async(req,res)=>{
    const obj = new User();
    console.log(req.body)
    const details = req.body;
    const result = await obj.deleteUser(details);
    res.send(result);
 });


 

app.listen(4000, ()=>{
    console.log("I am ready at 4000...")
})
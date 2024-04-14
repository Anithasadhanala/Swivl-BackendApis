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


    async deleteUser(id) {
        
        try {
            const sql = "DELETE FROM users WHERE id = ?;"        ;
            const data = await new Promise((resolve, reject) => {
                db.myQuery(sql, [id], (err, data) => {
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



class TravelDairy {


    constructor(title, description,location,date,photo,category){
        this.title = title;
        this.description =description;
        this.location = location;
        this.date = date;
        this.photo = photo;
        this.category  = category;
    }

    async createNewTravel(details){
        const {title, description, location, travelledDate, photo='', category,userId} = details;
        try {
            const id = uuidv4();
            const sql = "INSERT INTO traveldairy (id,userId, title, description,category, location, travelledDate, photo) VALUES (?,?,?,?,?,?,?,?) ;";
            const data = await new Promise((resolve, reject) => {
                db.myQuery(sql, [id,userId, title, description,category, location, travelledDate, photo], (err, data) => {
                    if (err) reject(err);
                    else resolve("Your travelling moment is successfully added");
                });
            });
            return data;
        }
        catch (error) {
            return error;
        }
    }

    async getSpecificTravel(id){
        try {
            let sql = "SELECT * FROM traveldairy WHERE id=?";
            const data = await new Promise((resolve, reject) => {
                db.myQuery(sql, [id], (err, data) => {
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

    async updateTraveldairy(details){
        const { id, title, description,category, location, travelledDate, photo} = details
        try {
            const sql = `UPDATE traveldairy SET title = IFNULL(?, title),description = IFNULL(?, description), category = IFNULL(?, category),photo = IFNULL(?, photo), location = IFNULL(?, location),travelledDate = IFNULL(?, travelledDate) WHERE id = ?`;
            const data = await new Promise((resolve, reject) => {
                db.myQuery(sql, [title,description,category,photo,location,travelledDate, id], (err, data) => {
                    if (err) {
                        console.error(err); // Log the error for debugging
                        reject(err);
                    } else {
                        resolve("Travel data is successfully updated");
                    }
                });
            });

            return data;
        } catch (error) {
            console.error(error); // Log any catched errors for debugging
            return error;
        }
    }


        async allTravelsOfSpecificUser(id){
            console.log(id,"^^^^^^^^^^^^^^")
            try {
                let sql = "SELECT * FROM usertraveldairy INNER JOIN traveldairy ON usertraveldairy.travelDairyId = traveldairy.id where usertraveldairy.userId = ?";
                const data = await new Promise((resolve, reject) => {
                    db.myQuery(sql, [id], (err, data) => {
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
    
    

    async deleteTraveldairy(id) {
        
        try {
            const sql = "DELETE FROM traveldairy WHERE id = ?;"        ;
            const data = await new Promise((resolve, reject) => {
                db.myQuery(sql, [id], (err, data) => {
                    if (err) {
                        console.error(err); // Log the error for debugging
                        reject(err);
                    } else {
                        resolve("Traveldairy is Deleted Successfully");
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

app.get('/user/:username',async(req,res)=>{
   const obj = new User();
   const userName = req.params.username
   const result = await obj.userExists(userName)
   res.send(result)
});


app.post('/register',async(req,res)=>{
    const obj = new User();
    const details = req.body;
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

 app.delete('/delete-user/:id',authentication,async(req,res)=>{
    const obj = new User();
    const id = req.params.id;
    const result = await obj.deleteUser(id);
    res.send(result);
 });


 app.get('/traveldairy/:id',authentication,async(req,res)=>{
    const obj = new TravelDairy();
    const id = req.params.id;
    const details = req.body;
    const result = await obj.getSpecificTravel(id)
    res.send(result)
 });


 app.post('/new-traveldairy',authentication,async(req,res)=>{
    const obj = new TravelDairy();
    const details = req.body;
    const result = await obj.createNewTravel(details)
    res.send(result)
 });



app.put('/update-traveldairy',authentication,async(req,res)=>{
    const obj = new TravelDairy();
    console.log(req.body)
    const details = req.body;
    const result = await obj.updateTraveldairy(details);
    res.send(result);
 })


 app.delete('/delete-traveldairy/:id',authentication,async(req,res)=>{
    const obj = new TravelDairy();
    const id = req.params.id;
    const result = await obj.deleteTraveldairy(id);
    res.send(result);
 });


 
 app.get('/all-travels/:id',async(req,res)=>{
    const obj = new TravelDairy();
    const userId = req.params.id;
    const result = await obj.allTravelsOfSpecificUser(userId)
    res.send(result)
 });







app.listen(4000, ()=>{
    console.log("I am ready at 4000...")
})
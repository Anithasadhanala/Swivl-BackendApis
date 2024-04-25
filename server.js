const express = require('express')
const {v4 : uuidv4} = require('uuid')
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const {sql,staticStrings,jwtSecretKey} = require("./data");
const Database = require("./dbConnection")
const configurationData = require("./config")

const app = express();
app.use(bodyParser.json());


// Instance of configured DB
const db = new Database(configurationData)


// middleware function for secure routes
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
      jwt.verify(jwtToken, jwtSecretKey.key , async (error, payload) => {
        if (error) {
          res.status(401);
          res.send("Invalid JWT Token");
        } else {
          next();
        }
      });
    }
  };

/*********************************************    USER CLASS STARTS HERE    *********************************************************** */

class User {

    constructor(userName, email, userPassword,gender,location,phone) {
        this.userName = userName;
        this.email = email;
        this.userPassword = userPassword;
        this.gender = gender;
        this.location = location;
        this.phone = phone;
    }

    // method for checking specific user Exists or not
    async userExists(userName) {
        try {
            const query =sql.GET_userQuery;
            const data = await new Promise((resolve, reject) => {
                db.myQuery(query, [userName], (err, data) => {
                    if (err) reject(err);
                    else resolve(data);
                });
            });
            return data;
        }
        catch (error) {
            return error;
        }
    }


    // method for checking specific mail Exists or not
    async emailExists (email){
        try {
            const query = sql.GET_emailQuery;
            const data = await new Promise((resolve, reject) => {
                db.myQuery(query, [email], (err, data) => {
                    if (err) reject(err);
                    else resolve(data);
                });
            });
            return data;
        }
        catch (error) {
            return error;
        }
    }


    // method for user Registration
    async registerUser(details){

        const {userName, email, userPassword, gender, location, phone} = details;
        if(  (await this.userExists(userName)).length == 1){
            return staticStrings.userAlreadyExists;
        }
        if((await this.emailExists(email)).length > 0){
            return staticStrings.emailAlreadyExists;
        }
        try {
            const hashedPassword = await bcrypt.hash(userPassword, 10);
            const query = sql.POST_newUserQuery;
            const id = uuidv4();
            const data = await new Promise((resolve, reject) => {
                db.myQuery(query, [id,userName,phone,email, gender, location, hashedPassword], (err, data) => {
                    if (err) reject(err);
                    else resolve(staticStrings.userRegistered);
                });
            });
            return data;
        }
        catch (error) {
            return error;
        }
    }


    // method for user Login
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
                const jwtToken = jwt.sign(payload, jwtSecretKey.key);
                return ({ jwtToken });
            } else {
            return  staticStrings.invalidPassword;
            }
        }
        return staticStrings.userDoesNotExists;
    };


    // method for reseting new password 
    async resetPassword(details){
        const {newPassword,confirmPassword,id} = details
        let password = newPassword;
        if(newPassword === confirmPassword){
            password = await bcrypt.hash(newPassword, 10);
            try{
                const query = sql.PUT_resetPasswordQuery;
                const data = await new Promise((resolve, reject) => {
                    db.myQuery(query, [password, id], (err, data) => {
                        if (err) {
                            console.error(err); // Log the error for debugging
                            reject(err);
                        } else {
                            resolve(staticStrings.passwordReset);
                        }
                    });
                });
                return data;
            }
            catch (error) {
                console.error(error); // Log any catched errors for debugging
                return error;
            }
        }
        return staticStrings.passwordMismatch;
}


    // method for user profile updations
    async updateUserProfile(details) {
        const { userName , userPassword,location,email,phone,gender , id } = details;
        try {
            let password = userPassword
            if(password != undefined){
                 password = await bcrypt.hash(userPassword, 10);
            }
            const query = sql.PUT_updateUserProfileQuery;
            const data = await new Promise((resolve, reject) => {
                db.myQuery(query, [userName,password,gender,phone,location,email, id], (err, data) => {
                    if (err) {
                        console.error(err); // Log the error for debugging
                        reject(err);
                    } else {
                        resolve(staticStrings.userProfileUpdated);
                    }
                });
            });
            return data;
        } catch (error) {
            console.error(error); // Log any catched errors for debugging
            return error;
        }
    }

 
    async deleteAllJunctionEntries (userId){
        try {
            const query = sql.DELETE_junctionTableEntries;
            const data = await new Promise((resolve, reject) => {
                db.myQuery(query, [userId], (err, data) => {
                    if (err) {
                        reject(false);
                    } else {
                        resolve(true);
                    }
                });
            });
            return data;
        } catch (error) {
            return error;
        }
    }

    // method for deleting specific user
    async deleteUser(id) {
        try {
            const junctionUserDeleted =async () =>{
                if((await this.deleteAllJunctionEntries(id))===false){
                    return false;
                }
                return true;
            }
            
            const query = sql.DELETE_deleteUserQuery;
            const data = await new Promise((resolve, reject) => {
                db.myQuery(query, [id], (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        if(junctionUserDeleted()===false) reject(staticStrings.deleteAllJunctionEntries)
                        resolve(staticStrings.userDeleted);
                    }
                });
            });
            return data;
        } catch (error) {
            return error;
        }
    }
}

/**********************************************    TRAVEL CLASS STARTS HERE     ********************************************* */

class TravelDairy {


    constructor(title, description,location,date,photo,category){
        this.title = title;
        this.description =description;
        this.location = location;
        this.date = date;
        this.photo = photo;
        this.category  = category;
    }


    async createEntryInJunctionTable(details){
        const {userId,travelDairyId} = details;
        try {
            const query = sql.POST_junctionTableEntry;
            const data = await new Promise((resolve, reject) => {
                db.myQuery(query, [userId,travelDairyId], (err, data) => {
                    if (err) reject(false);
                    else resolve(true);
                });
            });
            return data;
        }
        catch (error) {
            return error;
        }
    }


    // method for creating new travel location
    async createNewTravel(details){
        const {title, description, location, travelledDate, photo='', category,userId} = details;
        try {
            const id = uuidv4();
            const details = {
                userId : userId,
                travelDairyId  : id,
            }

            const juctionFieldCreaction =async () =>{
                if((await this.createEntryInJunctionTable(details)) === false){
                    return false
                }
                return true;
            }
            
            const query = sql.POST_newTravelQuery;
            const data = await new Promise((resolve, reject) => {
                 db.myQuery(query, [id,userId, title, description,category, location, travelledDate, photo], (err, data) => {
                    if (err) reject(err);
                    else{
                        if(juctionFieldCreaction()===false) reject(staticStrings.junctionTableNotCreation)
                        resolve(staticStrings.newTravelAdded);
                    } 
                });
            });
            return data;
        }
        catch (error) {
            return error;
        }
    }


    // method for fetching specific travel location
    async getSpecificTravel(id){
        try {
            const query = sql.GET_specificTravelQuery;
            const data = await new Promise((resolve, reject) => {
                db.myQuery(query, [id], (err, data) => {
                    if (err) reject(err);
                    else resolve(data);
                });
            });
            return data;
        }
        catch (error) {
            return error;
        }
    }


    // method for updating travelling location
    async updateTraveldairy(details){
        const { id, title, description,category, location, travelledDate, photo} = details
        try {
            const query = sql.PUT_updateTravelDairyQuery;
            const data = await new Promise((resolve, reject) => {
                db.myQuery(query, [title,description,category,photo,location,travelledDate, id], (err, data) => {
                    if (err) {
                        console.error(err); // Log the error for debugging
                        reject(err);
                    } else {
                        resolve(staticStrings.travelUpdated);
                    }
                });
            });
            return data;
        } catch (error) {
            console.error(error); // Log any catched errors for debugging
            return error;
        }
    }


    // method for fetching all travellings of specific user
    async allTravelsOfSpecificUser(id){
        try {
            const query = sql.GET_allTravelsOfSingleUserQuery;
            const data = await new Promise((resolve, reject) => {
                db.myQuery(query, [id], (err, data) => {
                    if (err) reject(err);
                    else resolve(data);
                });
            });
            return data;
        }
        catch (error) {
            return error;
        }
    }


    // method for filtering travels based on query parameters
    async filteringTravels (details){
        const {offset,order,order_by,limit,search_q} = details
        try {
            const query = sql.GET_filteringTravelsQuery
            const data = await new Promise((resolve, reject) => {
                db.myQuery(query, [search_q,order_by,order,limit,offset], (err, data) => {
                    if (err) reject(err);
                    else resolve(data);
                });
            });
            return data;
        }
        catch (error) {
            return error;
        }

    }
    

    // method for deleting a specific travelling location
    async deleteTraveldairy(id) {
        
        try {
            const query = sql.DELETE_deleteTravelDairyQuery;
            const data = await new Promise((resolve, reject) => {
                db.myQuery(query, [id], (err, data) => {
                    if (err) {
                        console.error(err); // Log the error for debugging
                        reject(err);
                    } else {
                        resolve(staticStrings.travelDeleted);
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





/********************************************************   ROUTES STARTS FROM HERE  *************************************************** */




//POST user Registration
app.post('/register',async(req,res)=>{
    const obj = new User();
    const details = req.body;
    const result = await obj.registerUser(details)
    res.send(result)
 });



//POST user Login
 app.post('/login',async(req,res)=>{
    const obj = new User();
    const details = req.body;
    const result = await obj.loginUser(details);
    res.send(result);
 })


//POST forgot password email Existance
app.post('/forgot-password/email',async(req,res)=>{
const obj = new User();
const {email} = req.body;
const result = await obj.emailExists(email);
res.send(result);
});


//PUT  user profile update
 app.put('/profile-update',authentication,async(req,res)=>{
    const obj = new User();
    const details = req.body;
    const result = await obj.updateUserProfile(details);
    res.send(result);
 })


//PUT reset the password
app.put('/forgot-password/reset-password',async(req,res)=>{
const obj = new User();
const details = req.body;
const result = await obj.resetPassword(details);
res.send(result);
});


//DELETE user delete
 app.delete('/delete-user/:id',authentication,async(req,res)=>{
    const obj = new User();
    const id = req.params.id;
    const result = await obj.deleteUser(id);
    res.send(result);
 });









//GET fetching a specific travel
 app.get('/traveldairy/:id',authentication,async(req,res)=>{
    const obj = new TravelDairy();
    const id = req.params.id;
    const details = req.body;
    const result = await obj.getSpecificTravel(id)
    res.send(result)
 });



//GET fetch all travels of a specific user
app.get('/all-travels/:id',authentication,async(req,res)=>{
const obj = new TravelDairy();
const userId = req.params.id;
const result = await obj.allTravelsOfSpecificUser(userId)
res.send(result)
});



//GET all filtered travels
app.get('/travels/',authentication,async(req,res)=>{
    const obj = new TravelDairy();
    const {offset = 0,limit = 10,order = "ASC",order_by = "title",search_q = ""} = req.query;
    const details = {
        "offset" : offset,
        "limit" : limit,
        "order" : order,
        "order_by" : order_by,
        "search_q": '%'+search_q+'%',
    }
    const result = await obj.filteringTravels(details)
    res.send(result)
 });



//POST creating new travel dairy
 app.post('/new-traveldairy',authentication,async(req,res)=>{
    const obj = new TravelDairy();
    const details = req.body;
    const result = await obj.createNewTravel(details)
    res.send(result)
 });



//PUT updating travel dairy
app.put('/update-traveldairy',authentication,async(req,res)=>{
    const obj = new TravelDairy();
    const details = req.body;
    const result = await obj.updateTraveldairy(details);
    res.send(result);
 })


//DELET a specific travelDairy
 app.delete('/delete-traveldairy/:id',authentication,async(req,res)=>{
    const obj = new TravelDairy();
    const id = req.params.id;
    const result = await obj.deleteTraveldairy(id);
    res.send(result);
 });







app.listen(4000, ()=>{
    console.log("I am ready at 4000...")
})
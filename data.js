const sql = {
    GET_userQuery : "SELECT * FROM users WHERE userName=?",
    GET_emailQuery :  "SELECT * FROM users WHERE email=?",
    POST_newUserQuery : "INSERT INTO users (id, userName, phone, email, gender, location, userPassword) VALUES (?,?,?,?,?,?,?) ;",
    PUT_resetPasswordQuery : "UPDATE users SET userPassword =?  WHERE id = ?;",
    PUT_updateUserProfileQuery:  `UPDATE users SET userName = IFNULL(?, userName),userPassword = IFNULL(?, userPassword), gender = IFNULL(?, gender),phone = IFNULL(?, phone), location = IFNULL(?, location),email = IFNULL(?, email) WHERE id = ?`,
    DELETE_deleteUserQuery :  "DELETE FROM users WHERE id = ?;",
    POST_newTravelQuery:  "INSERT INTO traveldairy (id,userId, title, description,category, location, travelledDate, photo) VALUES (?,?,?,?,?,?,?,?) ;",     
    GET_specificTravelQuery: "SELECT * FROM traveldairy WHERE id=?",   
    PUT_updateTravelDairyQuery :  `UPDATE traveldairy SET title = IFNULL(?, title),description = IFNULL(?, description), category = IFNULL(?, category),photo = IFNULL(?, photo), location = IFNULL(?, location),travelledDate = IFNULL(?, travelledDate) WHERE id = ?`,
    GET_allTravelsOfSingleUserQuery : "SELECT * FROM usertraveldairy INNER JOIN traveldairy ON usertraveldairy.travelDairyId = traveldairy.id where usertraveldairy.userId = ?",
    GET_filteringTravelsQuery : `SELECT * FROM traveldairy WHERE title LIKE ? ORDER BY ? ? LIMIT ? OFFSET ?`,
    DELETE_deleteTravelDairyQuery :  "DELETE FROM traveldairy WHERE id = ?;"  
}


const jwtSecretKey = {
    key : "ANITHA",
}



const staticStrings = {
    userAlreadyExists : "User Already Exists.",
    emailAlreadyExists : "Email Already Exists.",
    userRegistered : "User Registered Successfully.",
    invalidPassword : "Invalid Password.",
    userDoesNotExists : "User doesn't Exists.",
    passwordReset : "Password Reset Successfully.",
    userProfileUpdated : "User Profile details updated Successfully.",
    userDeleted : "User deleted Successfully.",
    newTravelAdded : "New Travel added Successfully.",
    travelUpdated : "Travel details are updated Successfully.",
    travelDeleted : "Travel deleted Successfully.",
    passwordMismatch : "New Password and Confirm Password are not Equal"
}

module.exports = {sql,staticStrings,jwtSecretKey}


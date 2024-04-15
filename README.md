
# SWIVL Backend APIs

These 12 Travel Dairy app APIs build with OOPS, much secure and are ready to intergrate with the frontend environment remotely or locally.

# V1.0.0
This is an initial version of the Swivl Backend APIs

# Must Know About

This project is purely implemented for the keeping track of the provided Documentation.

# Technologies used are :

```
server : oops Javascript, Node.js v21.5.0, Express.js v4.0, POSTMAN (testing).

other packages & lib : uuid library, bcrypt library, jwt library, body parser package, nodemon(dev)

DataBase : Mysql v8.0, Mysql workbench (Hosted at freesqlDB)
```

# Main Features of the Travel Dairy APIs : 

```
1. OOPS in javascript for Encapsulated modules and authorised routes.
2. There are 2 main classes " user "  and  " TravelDairy ".
3. APIs of user class: ( total 6)
      3.1 - creating a new User
      3.2 - user login
      3.3 - user profile update
      3.4 - forgot password email Exists or not
      3.5 - reset password
      3.6 - delete a specific user
4. APIs of TravelDairy class: (totol 6)
      4.1 - creating a new travel
      4.2 - updating a specific travel
      4.3 - fetching all travels by a specific user
      4.4 - fetching a specific travel with ID
      4.5 - fetching the travels with filters specified****
      4.6 - delete a specific travel
5. Middleware Authorization function for secure routes.
6. Added ER-schema of the Database & Documentation for using these APIs.

``` 


# Remotely Published host : 

```
https://swivl-backendapis.onrender.com

```

# Test the APIs using POSTMAN collection Remotely :

step 1 : Signin on your postman \\
step 2 : click on import \\
step 3 : paste the url \\
```
https://api.postman.com/collections/34264027-b73756c6-0a8a-40f5-901c-a43c0eedbcff?access_key=PMAT-01HVFZJQPB7QNR3MRVQHZG7NAS
```
step 4 : make as a copy \\
step 5 : Now, you can test the APIs remotely :D




# DataBase ER - Schema

```
https://drive.google.com/file/d/1v4b1u-TJ1_ZHz3XNLWQ-F6gUqnDjtiyd/view

```

# Documentation for Using the APIs

```
https://docs.google.com/document/d/11riFGvdNr7G5dh5uS7_8XMywY_SKYGbK

```




## Getting Started

1.Clone the repository to your local machine:

```git
git clone https://github.com/Anithasadhanala/Swivl-BackendApis

```


2.Install the dependencies:

```git
npm install
```


3.After install, open the terminal again and run:

```git
node server.js
```

-> After modifing the changes to this project, you can deploy

4.Deployment:

```chrome
Go to onrender.com
commit with your git account and deploy.
```



## Deployment

To deploy this project run

```bash
  npm run deploy
```


## Contribution Guide
- Fork the repository: 
```
Click the "Fork" button on the repository page to create your own copy.
```


- Clone the forked repository:
```
 Use git clone to download the repository to your local machine.
```
- Create a new branch: use
```
 git checkout -b my-feature
```
  to create a new branch for your changes.



- Make your changes:
```
 Customize the template, add new features, fix bugs, or improve the existing codebase.
```
- Commit your changes: Use
```
 git add . 
 ```
 to stage your changes, then git commit -m "Add a descriptive commit message" to commit them.



- Push your changes: use
``` 
git push origin my-feature 
```
to push your changes to your forked repository.

- Create a pull request:
``` 
come to this repository on GitHub, click "New pull request," select your forked repository and branch, add a descriptive title and comment, and submit the pull request.
```

- Once your pull request is submitted, I can review and merge your changes. Make sure to respond to any feedback during the review process.




## License

[MIT](https://choosealicense.com/licenses/mit/)





## Authors

- [@Anithasadhanala](https://github.com/Anithasadhanala)









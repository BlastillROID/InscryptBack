# Inscrypt Nodejs Server

This is the Backend Server for the Inscrypt Wallet financial solution linking the communications between the mobile app and the web wallet with the company's business logic and its Database.

## Getting Started

To run the project:
1. first and foremost clone or fork the GitRepo and orient your terminal to the root Dir, `run npm install` to install the needed node modules (if the `node_modules` folder already exists please delete it first).

2. Finally and after installing the needed node modules you can proceede with executing the Command `npm start`. if the prerequisites are all met the project sure be running perfectly. 

### Prerequisites

1. Node.js
2. Node Package Manager (npm)
3. Mongodb
4. Postman for testing Requests

### Installing

#### Linux
```
  1. sudo apt-get install nodejs
  2. sudo apt-get install npm
  3. sudo apt-get install mongodb

```

## Deployment

Server Image available at : [Live Inscrypt Server Link](http://ec2-3-84-159-10.compute-1.amazonaws.com:4000/)

## Server Paths (/Routes)

### Users (/users):
This the general route to all User related paths , servers also as a way to get all users form the database.
* **Paramaters (POST):**
  - email
  - password
  - firstName
  - lastName
  - phoneNumber
  - address:{
    - country,
    - city, 
    - street,
    - houseNumber
    }

* P.S : * if the Resquest is **POST** then it's a SignUp route if **GET** then it views all users in the database
        * all the upcoming user related routes starts with /users:
  
#### Login (/users/login):
   This is the basic Login (POST) Request 
* **Parameters:**
    - email: user email.
    - password: user password.

#### fetch (/users/fetch):
   This is a GET request to get a certain user
* **Parameters:**
    - Header: authorization


## Versioning

We use [SemVer](http://semver.org/) for versioning. 

## Authors

* **Missaoui Mounir** - *Initial work* - [BlastillROID](https://github.com/BlastillROID)

See also the list of [contributors](https://github.com/BlastillROID/InscryptBack/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

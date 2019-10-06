# Authentication-System-Api
###A Basic Authentication system built in Node.js

##Installation & Setup
1. Install [Node.js](https://nodejs.org "Node.js") and [MongoDB](https://www.mongodb.com).
2. Clone this repository and install its dependencies
```console
$ git clone https://github.com/tariqiqbal27/authentication-system
$ cd authentication-system
$ npm install
```
3. Edit the config.js file and enter database name
```nodejs
module.exports = {
        MongoURL: 'mongodb://127.0.0.1:27017/your-database-name
}
```
4. From within the authentication-system directory start the server
```console
$ npm run dev
```
5. Access the Server Api from localhost/3000

##Usage
- ### For CREATING AN ACCOUNT
**Request**
```http
POST /register
```
**Body - JSON**
```json
{
	"email":"auth@example.com",
	"password":"anythingthatyoulike"
}
```
**Response - JSON**
```json
{
    "code": "ACCOUNT_CREATED",
    "msg": "User Created"
}
```

- ### For LOGIN
**Request**
```http
POST /login
```
**Body - JSON**
```json
{
	"email":"auth@example.com",
	"password":"anythingthatyoulike"
}
```
**Response - JSON**
```json
{
    "id": "5d9908678d1d0e1144c87b2c"
}
```

- ###For GETTING AUTHENTICATED USER DATA
**Request**
```http
GET /user
```
**Response - JSON**
```json
{
    "_id": "5d9908678d1d0e1144c54c2c",
    "email": "auth@example.com",
    "createdAt": "2019-10-05T21:17:27.379Z",
    "updatedAt": "2019-10-05T21:17:27.379Z"
}
```

- ###For GETTING USER ID
**Request**
```http
GET /user/userid
```
**Response - String**
`5d9908678d1d0e1144c54c2c`

- ### For LOGOUT
**Request**
```http
POST /user/logout
```
**Response - JSON**
```json
{
    "code": "AUTH_LOGOUT_SUCCESS",
    "msg": "Logout Successfully"
}
```

- ###For CHANGING USER PASSWORD
**Request**
```http
PATCH /user/change_password
```
**Body - JSON**
```json
{
	"old_password":"password1",
	"new_password":"password2"
}
```
**Response - JSON**
```json
{
    "code": "AUTH_PASSWORD_CHANGE",
    "msg": "Password changes Successfully"
}
```

- ###For DELETING USER
**Request**
```http
DELETE /user/delete
```
**Response**
```json
{
    "code": "DELETED_OK",
    "msg": "Account Deleted"
}
```

##Exception Handling
###Session Exception
- ####If User is not Authenticated
**Response**
```json
{
    "code": "AUTH_NOT_SUCCESS",
    "msg": "User not Authenticated"
}
```
- ####If User is Authenticated
**Response**
```json
{
    "code": "AUTH_OK",
    "msg": "User already authenticated"
}
```

###Register Exception
- ####if Password length is less than 8
**Response**
```json
{
    "code": "AUTH_MIN_PASSWORD",
    "msg": "Password length must be greater than 7"
}
```
- ####if Email Already registed
**Response**
```json
{
    "code": "EMAIL_ALREADY_EXIST",
    "msg": "Email Already Exist"
}
```
- #### if Email & Password Field are blank
**Response**
```json
{
    "code": "AUTH_BLANK_FIELD",
    "msg": "Enter Email/Password"
}
```

###Login Exception
- ####If Email Or Password are wrong
**Response**
```json
{
    "code": "LOGIN_INVALID",
    "msg": "Email & password wrong"
}
```
###Change Password
- ####if Old password is wrong
**Response**
```json
{
    "code": "AUTH_PASSWORD_INCORRECT",
    "msg": "Incorrect Account Password"
}
```
- ####if New password and Old password are same
**Response**
```json
{
    "code": "AUTH_PASSWORD_SAME",
    "msg": "New Password cannot be old password"
}
```

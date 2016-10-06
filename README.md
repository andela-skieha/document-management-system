# Goldocs

[![CircleCI](https://circleci.com/gh/andela-skieha/document-management-system/tree/master.svg?style=svg)](https://circleci.com/gh/andela-skieha/document-management-system/tree/master)
[![Coverage Status](https://coveralls.io/repos/github/andela-skieha/document-management-system/badge.svg?branch=master)](https://coveralls.io/github/andela-skieha/document-management-system?branch=master)

## Checkpoint Explanation
Goldocs is a document management system API built out in Javascript. It allows the end user to be able to create documents, and be able to share them with other people.

## Requirements for setup

* [node.js version ^6.2.2](https://nodejs.org/en/)

* [mongodb](http://mongodb.github.io/node-mongodb-native/2.1/)

* [Postman](https://www.getpostman.com/)

## Usage

* Clone the repository on your machine using the command:

`git clone https://github.com/andela-skieha/document-management-system.git`

* Navigate to where you cloned the project and `cd` into it:

`cd path/to/project/document-management-system`

* Run `npm install` to install the project's dependencies.

* Create a `.env` file in the root of the project and set the environment variables needed to run the project:

```
MONGO_PROD_URL=mongodb://localhost/dms
MONGO_TEST_URL=mongodb://localhost/dms-test
MONGO_SECRET='this is super secret'
```

* Run `npm start` to get the server running.

## Tests

* Navigate to where you cloned the project and `cd` into it:

`cd path/to/project/document-management-system`

* Run `npm test` to seed the database and run tests for the system.

### HTTP Verbs, Routes and Endpoints

#### Login/Signup

* Signup

`POST` `http://localhost:5000/api/users/signup`

* Login

`POST` `http://localhost:5000/api/users/login`

#### Users

* Get all users

`GET` `http://localhost:5000/api/users`

* Get user by id

`GET` `http://localhost:5000/api/users/:user_id`

* Edit user details

`PUT` `http://localhost:5000/api/users/:user_id`

* Delete user account

`DELETE` `http://localhost:5000/api/users/:user_id`

#### Documents

* Create new document

`POST` `http://localhost:5000/api/documents`

* Get all documents

`GET` `http://localhost:5000/api/documents`

* Get document by id

`GET` `http://localhost:5000/api/documents/:id`

* Edit document details

`PUT` `http://localhost:5000/api/documents/:id`

* Delete document

`DELETE` `http://localhost:5000/api/documents/:id`

* Get documents belonging to a particular user

`GET` `http://localhost:5000/api/users/:user_id/documents`

* Get document by roles

`GET` `http://localhost:5000/api/search?role=role_title`

* Get documents by creation date

`GET` `http://localhost:5000/api/search?date=created_at_date`

* Get paginated documents

`GET` `http://localhost:5000/api/documents?limit=set_limit&offset=set_offset`

#### Roles

* Create new role

`POST` `http://localhost:5000/api/roles`

* Get all roles

`GET` `http://localhost:5000/api/roles`

* Get role by id

`GET` `http://localhost:5000/api/roles/:id`

* Edit role details

`PUT` `http://localhost:5000/api/roles/:id`

* Delete role

`DELETE` `http://localhost:5000/api/roles/:id`

* Get roles belonging to a particular user

`GET` `http://localhost:5000/api/users/:user_id/roles`

### Testing with Postman

* Run `npm start` to start up the server.

* Open up Postman on your machine.

* Visit the `signup` route above and create a new user with the POST verb.

`POST` `http://localhost:5000/api/users/signup`

* Visit the `login` route above and with the new user's `username` and `password`, login to get a token:

`POST` `http://localhost:5000/api/users/login`

* Take the token created, and set it in the `Headers` section of Postman in order to be able to access the rest of the routes:

`x-access-token: token_received_on_login`


###### *Made with ❤️ by [Njeri Kieha](https://github.com/andela-skieha)*

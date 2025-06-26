- S2E10
===========
- Install cookie-parser
- Create a dummy cookie to the user
- create GET / profile Api and check if the user gets the cookie back
- Install jsonwebtoken
- In login Api after the email and password validation, create JWT token and send it to user in cookie
- read the cookies inside your profile Api and find the logged in user   
- userAuth Middleware
- Add the useAuth middleware in profile API and a new sendConnectionRequest API
- Set the expiry of JWT token and cookiew to 7days
- Create userSchema method to getJWT()
- Create userSchema method to validatePassword(passwordByUser)


- S2E11
==========
- Create a list of all the API you can think of for dev tinder
- Group multiple routes under respective routers
- Read documentation for express.Router
- create routes folder for managing auth, profile, request routers
- create authRouter,profileRouter,requestRouter
- Import these router to app.js
- create POST/logout API
- create PATCH/profile/edit
- create PATCH/profile/password API => forgot password API
- Make sure to validate all the data in every POST,PATCH apis

- S2E12
==========
- Create connectionRequest Schema
- send connection request api
- proper validation for the data
- think of all the edge cases
- $or /$and query
- schema.pre("save").function(){...,next()}=>as it is like a middleware
- Read more about indexes in MongoDb
- What is the advantages and disadvantages of creating indexes ?

- S2E13
=========
- Write code with proper validations for POST / request/review/:status/:requestId
- Thought process - POST vs GET
- Read about ref and populate (https://mongoosejs.com/docs/populate.html)
- Create GET/user/requests/received with proper validations

- S2E14
==========
- Build feed api 
- Rules => User should not see the below cards
- 1. His own card
- 2. his connections
- 3. ingnored cards
- 4. Already send the connection request cards

- S2E15 => Building Feed Api and Pagination
==========
- Logic for GET/feed API
- Explore more on the $nin, $and, $ne and other query operators
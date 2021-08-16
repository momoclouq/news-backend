## Project: News

---

### Getting started
1. use `git status` to check if your version is still the newest, use `git fetch` to load others' branch
2. check out to your own branch
3. use `npm install` to install all new dependencies
4. use `npm run devstart` to run nodemon for auto save-rerun of the server, if not use `npm start`
5. commit your changes! and push them to github

---

## API 

Some terms: 
- model: A structure to create document, similar to class in Java
- document: An instance of a Model (mongodb), similar to an object instance

--- 

### Authentication
1. **Sign up**  
    Path: **/signup**  
    Command: **POST**  
    Params: None  
    Req.body:   
        - username: String, required, max length: 50  
        - fullname: String, required, max length: 100  
        - email: Email form, required  
        - password: required  
        - city: String, optional  
        - country: String, optional    

    Return: the entire user document  
    Error: this will return a 401 status error, catch it from frontend

2. Log in:
    Path: **/login**  
    Command: **POST**  
    Params: None  
    Req.body:  
        - email: user email  
        - password: user password   

    Return: Token unique to the user, save this token for authentication  
    Error: this will return a 401 status error, catch it from frontend  

### User
1. **Get user by id**  
    Path: **/user/:userid**  
    Command: **GET**  
    Params: None  
    Req.body: None  
    Return: "foundUser". Include fields: username, fullname, city, country, created_date (date).  
    Error: "errors". content: "user not found"  

2. **Get current user (logged in)**  
    Path: **/user**  
    Command: **GET**  
    Params: secret_token (token received when log in)  
    req.body: None  
    Return: "userFound". Include fields: username, fullname, city, country, created_date, email, word_collection (array of string: id), news_collection (array of string: id)  
    Error: "errors". content: "user not found"  

3. **Update the current user (logged in)**  
    Path: **/user**  
    Command: **PUT**  
    Params: secret_token (token received when log in)  
    req.body:  
        - fullname: String, max length: 100, optional  
        - city: String, optional   
        - country: String, optional   
    Return: "success". Content: "user updated"  
    Error: "errors". content: "fullname must be ..." or "city must be a string" or "country must be a string"    

4. **Delete the current user (logged in)**  
    Path: **/user**  
    Command: **DELETE**  
    Params: secret_token (token received when log in)  
    req.body: None  
    Return: "message". Content: "user deleted"  
    Error: "errors". Content: "user not found"  

### Collection  
1. **Create a new collection**  
    Path: **/collection**  
    Command: **POST**  
    Params: secret_token (token received when log in)  
    req.body: 
        - name: String, max length: 100, required
        - type: String, ["word"] or ["news"]  

    Return: 
        - "success". Content: "user not found"  
        - "collectionid". The newly created collection's id  

    Error: "errors". content: "name must be less ..." or "type must be either: word or news"  

2. **Get all collection of the user**  
    Path: **/collection**  
    Command: **GET**  
    Params: secret_token (token received when log in)  
    req.body: None

    Return: "collections". An array of all collection. Include fields: type, name, created_date 

    Error: None

3. **Get collection by id**  
    Path: **/collection/:collectionid**  
    Command: **GET**  
    Params: secret_token (token received when log in)  
    req.body: None

    Return: "collection". Contains every field related to the collection  

    Error: "errors". Content: "collection not found"

4. **Update collection by id**  
    Path: **/collection/:collectionid**  
    Command: **PUT**  
    Params: secret_token (token received when log in)  
    req.body:  
        - name: String, max length: 100, required  
        - created_date: date, optional  

    Return: "success". Content: "collection is updated"  

    Error: "errors". Content: "collection cannot be found"   

5. **Delete collection by id**  
    Path: **/collection/:collectionid**  
    Command: **DELETE**  
    Params: secret_token (token received when log in)  
    req.body: None  

    Return: "success". Content: "collection deleted"  

    Error: "errors". Content: "collection cannot be found" or "user does not exist"  

### Word
1. **Create a new word**  
    Path: **/collection/:collectionid/word**  
    Command: **POST**  
    Params: secret_token (token received when log in)  
    req.body:  
        - value: String, required
        - note: String, optional, max length: 200  

    Return: "success". Content: "word is created for collection :collectionid"  

    Error: "errors". Content: "word must be not empty" or "Note must be less than 200 ..."  

2. **Get word by id**  
    Path: **/collection/:collectionid/word/:wordid**  
    Command: **GET**  
    Params: secret_token (token received when log in)  
    req.body: None  

    Return: "word". return all related field from word document

    Error: "errors". Content: "word is not found"  

3. **Update word by id**  
    Path: **/collection/:collectionid/word/:wordid**  
    Command: **PUT**  
    Params: secret_token (token received when log in)  
    req.body:   
        - note: String, max length: 200, required

    Return: "success". old word (before update)

    Error: "errors". Content: "note must be less than ....."  

4. **Delete word by id**  
    Path: **/collection/:collectionid/word/:wordid**  
    Command: **DELETE**  
    Params: secret_token (token received when log in)  
    req.body: None  

    Return: "success". content: "Word deleted"  

    Error: "errors". Content: "word is not found" or "collection does not exist"  

5. **Get all words from a collection**
    Path: **/collection/:collectionid/word**  
    Command: **GET**  
    Params: secret_token (token received when log in)  
    req.body: None  

    Return: "allWords". An array of word documents (with all fields)   

    Error: "errors". Content: "collection not found"  


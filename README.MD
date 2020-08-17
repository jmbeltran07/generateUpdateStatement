# Generate Update Statement

In order to solve this problem the following files are used:

* **generateUpdateStatement.js**: It contains generateUpdateStatement(document, mutation) function which returns an update statement object
* **index.js**: It contains a sample [express] server to test the function online via [POST] /generateUpdateStatement
* **typeValidator.js**: It uses [tcomb] library to validate the input object
* **tests/***: It contains the testing data (originalDocument, and testing mutations) as well as the test suite using [jest] library

This solution is using a OOP approach, where we analyze the mutation input against the document structure that we are supposed to have, and decide what kind of output operation we are handling depending on the structure of our input.
I am using nested if/else statements to determine the possible outputs in order to favor a valid input structure and reject as "invalid operation" wrong inputs
  
### Installation

generateUpdateStatement was built using [Node.js](https://nodejs.org/) v12.18.2 
Install the dependencies

```sh
git clone https://github.com/jmbeltran07/generateUpdateStatement.git
cd generateUpdateStatement
npm install
```
  
### Testing

This project uses [jest] as testing framework.
you can see the tests under
```
tests/testingData.js
```
in there you will see three objects:
* testingData: which contains the base tests mentioned on the assignment
* extraTestingData: which contains extra texts used for Test driven design.
* originalDocument: which contains the original document used for the tests
 
to run the test suite just input the following command under root folder
```
npm run test
```

### Online test

You can run a server to test the behavior online, we are using a simple express server to do it.
you can just input the following command to use it.
```
npm run start
```
This will kick off the server on port 3000
```
http://localhost:3000
```

**API**
| Method | Route                    | headers | body                                                                            | example response                                         |
|--------|--------------------------|---------|---------------------------------------------------------------------------------|----------------------------------------------------------|
| GET    | /                        | N/A     | N/A                                                                             | "Hello World!"                                           |
| POST   | /generateUpdateStatement | N/A     | { "document": {<YOUR DOCUMENT JSON HERE>}, "mutation": { YOUR MUTATION HERE } } | {  "$update" :  { "posts.1.mentions.0.text" :   "pear" } |

### Tech

This Project uses the following tech stack

* [Node.js] - >=v12.18.2 evented I/O for the backend
* [lodash] - used for immutable map operations and getting undefined instead of nasty "Uncaught TypeError: Cannot read property 'attributes' of undefined"
* [tcomb] - tcomb is a library for Node.js and the browser which allows you to check the types of JavaScript values at runtime.
* [Express] - fast node.js network app framework, used to test our function with Postman
* [body-parser] - Node.js body parsing middleware.
* [jest] - Jest is a delightful JavaScript Testing Framework with a focus on simplicity.

# Assumptions

**Output from first example on removing existing item is wrong**
```
 { "$remove" : {"posts.0" : "true"} }
```
and I assumed it should be:
```
{ "$remove" : {"posts.0" : true} } // notice true is boolean instead of string
```
This was assumed in order to remain consisteng with the other examples

**Output from second example for the update operation is wrong**
Input says:
```
 { "posts": [{"_id": 2, "mentions": [ {"_id": 5, "text": "pear"}]}] } 
```
and I assumed it should be:
```
 { "posts": [{"_id": 3, "mentions": [ {"_id": 5, "text": "pear"}]}] } // notice the id is now 3
```
This was assumed in order to be consistent with original Document information. So the output should be:
```
{ "$update": {"posts.1.mentions.0.text": "pear"}}
```
**Output is an object as shown in the examples instead of an array**
In the examples provided, the output is an object, so when we input multiple operations within a mutation, the output will not only convert the inputs and organize them in an array, but it will organize them in an object. 
Which means having more than one $add, $update, $remove per mutation is invalid
Example:
Input: 
```
{ "posts": [ 
    {"_id": 2, "value": "too"}, 
    {"value": "four"}, 
    {"_id": 4, "_delete": true}, 
    {"value": "five"}] 
}
```
Output
```
{
    "$update": {"posts.0.value": "too"},
    "$add": {"posts": [{"value": "five"}] },
    "$remove" : {"posts.2" : true}
}
// notice how $add operation was overwritten by {"value": "five"} operation
```


### How would I improve this code

 - Try a functional programming approach using [ramda] & [sanctuary], we could potentially implement a solution in less code with less potential bugs
 - This code is used for a particular object structure (see below), it would be good to make it more generic instead of depending of this structure (or maybe this could be solved updating typeValidator.js if the structure is important ?)
```
document = 
{ posts: [
    {
        "value": ...
        "mentions": [
            {
                "text": ...
            }
        ]
    }
]}
```

   [tcomb]: <https://github.com/gcanti/tcomb>
   [git-repo-url]: <https://github.com/jmbeltran07/generateUpdateStatement.git>
   [body-parser]: <https://www.npmjs.com/package/body-parser>
   [node.js]: <http://nodejs.org>
   [lodash]: <https://lodash.com/>
   [express]: <http://expressjs.com>
   [jest]: <https://jestjs.io/>
   [Gulp]: <http://gulpjs.com>
   [ramda]: <https://ramdajs.com/>
   [sanctuary]: <https://github.com/sanctuary-js/sanctuary>

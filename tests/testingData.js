const originalDocument = { 
    "_id": 1,
    "name": "Johnny Content Creator",
    "posts": [
      {
        "_id": 2,
        "value": "one",
        "mentions": []
      },
      {
        "_id": 3,
        "value": "two",
        "mentions": [
            {
                  "_id": 5,
                  "text": "apple"
            },
            {
                  "_id": 6,
                  "text": "orange"
            }
        ]
      },
      {
        "_id": 4,
        "value": "three",
        "mentions": []
      }
    ]
  }

// This tests comes from "Backend Take Home: Subdocument Array Mutation - Prompt" file
const testingData = [
    {
        'testName': 'update post',
        'input': { "posts": [{ "_id": 2, "value": "too" }] },
        'output': { "$update": {"posts.0.value": "too"} }
    },
    {
        'testName': 'update mention',
        'input': { "posts": [{ "_id": 3, "mentions": [{ "_id": 5, "text": "pear" }] }] },
        'output': { "$update": {"posts.1.mentions.0.text": "pear"}}
    },
    {
        'testName': 'add post',
        'input':{ "posts": [{ "value": "four" }] },
        'output': {"$add": {"posts": [{"value": "four"}] }}
    },
    {
        'testName': 'add mention',
        'input': { "posts": [{ "_id": 3, "mentions": [{ "text": "banana" }] }] },
        'output': {"$add": {"posts.1.mentions": {"text": "banana"}}}
    },
    {
        'testName': 'remove post',
        'input': { "posts": [{ "_id": 2, "_delete": true }] },
        'output': { "$remove" : {"posts.0" : true} }
    },
    {
        'testName': 'remove mention',
        'input': { "posts": [{ "_id": 3, "mentions": [{ "_id": 6, "_delete": true }] }] },
        'output': { "$remove" : {"posts.1.mentions.1": true}}
    },
    {
        'testName': 'multiple operation posts',
        'input': {
            "posts": [
                { "_id": 2, "value": "too" },
                { "value": "four" },
                { "_id": 4, "_delete": true }
            ]
        },
        'output': { 
            "$update": {"posts.0.value": "too"},
            "$add": {"posts": [{"value": "four"}] },
            "$remove" : {"posts.2" : true}
        }
    },
    {
        'testName': 'we dont care about conflicts',
        'input': { 
            "posts": [
                {"_id": 2, "value": "too"},
                {"_id": 2, "_delete": true}
            ]
        },
        'output': { 
            "$update": {"posts.0.value": "too"},
            "$remove" : {"posts.0" : true}
        }
    }
]

// These are extra personal tests I used for Test driven design
const extraTestingData =[
    {
        'testName': 'multiple operation mentions',
        'input': {
            "posts": [
                { "_id": 3, "mentions": [{ "_id": 5, "text": "pear" }] },
                { "_id": 3, "mentions": [{ "text": "banana" }] },
                { "_id": 3, "mentions": [{ "_id": 6, "_delete": true }] }
            ]
        },
        'output': { 
            "$update": {"posts.1.mentions.0.text": "pear"},
            "$add": {"posts.1.mentions": {"text": "banana"}},
            "$remove" : {"posts.1.mentions.1": true}
        }
    },
    {
        'testName': 'post id doesnt exists',
        'input': { "posts": [{ "_id": 10, "_delete": true }] },
        'output': { "invalid operation": true }
    },
    {
        'testName': 'mention id doesnt exists',
        'input': { "posts": [{"_id": 2, "mentions": [ {"_id": 20, "text": "pear"}]}] },
        'output': { "invalid operation": true }
    },
    {
        'testName': 'try to combine add and delete post',
        'input': {"posts": [{"value": "four", "_delete": true}] },
        'output': { "invalid operation": true }
    },
    {
        'testName': 'try to combine add and delete mention',
        'input': {"posts": [{"_id": 3, "mentions": [{"text": "banana", "_delete": true} ]}]},
        'output': { "invalid operation": true }
    },
    {
        'testName': 'try to delete both post and mentions',
        'input': { "posts": [{"_id": 3, "_delete": true, "mentions": [{"_id": 6, "_delete": true}]}]},
        'output': { "invalid operation": true }
    },
    {
        'testName': 'wrong type for id',
        'input': { "posts": [{ "_id": 'two', "value": "too" }] },
        'output': { "invalid mutation": true }
    },
    {
        'testName': 'wrong type for delete',
        'input': { "posts": [{ "_id": 2, "_delete": "deleteIt" }] },
        'output': { "invalid mutation": true }
    },
    {
        'testName': 'different object as argument',
        'input': {"hello": "world"},
        'output': { "invalid mutation": true }
    },
    {
        'testName': 'literal as argument',
        'input': 4,
        'output': { "invalid mutation": true }
    },
]
module.exports =
{
    originalDocument,
    testingData,
    extraTestingData
}
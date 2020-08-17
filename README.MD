ASSUMPTIONS
1) output from first example on removing existing items is wrong
it says: { "$remove" : {"posts.0" : "true"} } and I assumed it should be { "$remove" : {"posts.0" : true} } // notice true is boolean instead of string
I did this so it remains consistent with the other examples
2) output from update (second example) is wrong. Input says:
{ "posts": [{"_id": 2, "mentions": [ {"_id": 5, "text": "pear"}]}] }
and I think it should be [{"_id": 3, "mentions": [ {"_id": 5, "text": "pear"}]}] }, so it updates like this:
{ "$update": {"posts.1.mentions.0.text": "pear"}}
3) I'm assuming there can only be at max one type of operation per input when ussing multiple operations per input, since in the examples the result is an object instead of an array of outputs.
i.e the output for 
{ 
	"posts": [
		{"_id": 2, "value": "too"},
		{"value": "four"},
		{"_id": 4, "_delete": true}
	]
}
is 
{ 
	"$update": {"posts.0.value": "too"},
	"$add": {"posts": [{"value": "four"}] },
	"$remove" : {"posts.2" : true}
}

making this input:
{ 
	"posts": [
		{"_id": 2, "value": "too"},
		{"value": "four"},
		{"_id": 4, "_delete": true}
        {"value": "five"},
	]
}
invalid
const _ = require('lodash')
const { Mutation } = require('./typeValidator')

const generateUpdateStatement = (document, mutation) => {
    let output = {}
    let outputLine = {}

    // verify the input agains valid Mutation structure
    try {
        var validMutation = Mutation(mutation)
    } catch (e){
        output = { "invalid mutation": true }
        return output
    }
    // map against the valid Mutation to process each specific operation
    _.map(validMutation, (operations, subdocument) => {
        _.map(operations, (operation) => {
            // destructure the operation into ints potential values
            const {
                _id: postId = null,
                value = null,
                _delete: postDelete = false,
                mentions: [{
                    _id: mentionId = null,
                    _delete: mentionDelete = false,
                    text = null }
                ] = [{}] } = operation

            // calculate index against the provided document
            const postIndex = _.findIndex(_.get(document, 'posts'), { "_id": postId })
            const mentionIndex = _.findIndex(_.get(document, `posts.${postIndex}.mentions`), { "_id": mentionId })

            // if an id was provided, but index can't be found, then is an invalid operation
            if ((postId && postIndex === -1) || (mentionId && mentionIndex === -1)) {
                outputLine = { "invalid operation": true }
            } else {
                // There are 6 cases: $update, $add, $remove; each for posts and mentions
                // Check for update posts
                if (postId && value && !mentionId && !text && !postDelete && !mentionDelete) {
                    outputLine = _.set(outputLine, '$update', { [`${subdocument}.${postIndex}.value`]: value })
                }
                // Check for update mentions
                 else if (postId && !value && mentionId && text && !postDelete && !mentionDelete) {
                    outputLine = _.set(outputLine, '$update', { [`${subdocument}.${postIndex}.mentions.${mentionIndex}.text`]: text })
                } 
                // Check for add post
                else if (!postId && value && !mentionId && !text && !postDelete && !mentionDelete) {
                    outputLine = _.set(outputLine, "$add", { [`${subdocument}`]: [{ "value": value }] })
                } 
                // Check for add mention
                else if (postId && !value && !mentionId && text && !postDelete && !mentionDelete) {
                    outputLine = _.set(outputLine, "$add", { [`${subdocument}.${postIndex}.mentions`]: { 'text': text } })
                } 
                // Check for remove post
                else if (postId && !value && !mentionId && !text && postDelete && !mentionDelete) {
                    outputLine = _.set(outputLine, '$remove', { [`posts.${postIndex}`]: postDelete })
                } 
                // Check for remove mention
                else if (postId && !value && mentionId && !text && !postDelete && mentionDelete) {
                    outputLine = _.set(outputLine, '$remove', { [`${subdocument}.${postIndex}.mentions.${mentionIndex}`]: mentionDelete })
                } 
                // Else, we have an invalid operation
                else {
                    outputLine = { "invalid operation": true }
                }
            }
            // merge the operation line into the output object
            if (outputLine) {
                output = _.merge(output, outputLine)
            }
        })
    })
    return output
}



module.exports.generateUpdateStatement = generateUpdateStatement;
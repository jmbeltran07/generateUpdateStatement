const _ = require('lodash')
const { Mutation } = require('./typeValidator')

const generateUpdateStatement = (document, mutation) => {
    let output = {}
    let outputLine = {}
    try {
        var validMutation = Mutation(mutation)
    } catch (e){
        output = { "invalid mutation": true }
        return output
    }
    _.map(validMutation, (operations, subdocument) => {
        _.map(operations, (operation) => {
            const {
                _id: postId = null,
                value = null,
                _delete: postDelete = false,
                mentions: [{
                    _id: mentionId = null,
                    _delete: mentionDelete = false,
                    text = null }
                ] = [{}] } = operation
            let postIndex = _.findIndex(_.get(document, 'posts'), { "_id": postId })
            let mentionIndex = _.findIndex(_.get(document, `posts.${postIndex}.mentions`), { "_id": mentionId })
            // There are 6 cases: $update, $add, $remove; each for posts and mentions
            // Check for update posts
            // if an id was provided, but index can't be found, then is an invalid operation
            if ((postId && postIndex === -1) || (mentionId && mentionIndex === -1)) {
                outputLine = { "invalid operation": true }
            } else {
                if (postId && value && !mentionId && !text && !postDelete && !mentionDelete) {
                    outputLine = _.set(outputLine, '$update', { [`${subdocument}.${postIndex}.value`]: value })
                } else if (postId && !value && mentionId && text && !postDelete && !mentionDelete) {
                    outputLine = _.set(outputLine, '$update', { [`${subdocument}.${postIndex}.mentions.${mentionIndex}.text`]: text })
                } else if (!postId && value && !mentionId && !text && !postDelete && !mentionDelete) {
                    outputLine = _.set(outputLine, "$add", { [`${subdocument}`]: [{ "value": value }] })
                } else if (postId && !value && !mentionId && text && !postDelete && !mentionDelete) {
                    outputLine = _.set(outputLine, "$add", { [`${subdocument}.${postIndex}.mentions`]: { 'text': text } })
                } else if (postId && !value && !mentionId && !text && postDelete && !mentionDelete) {
                    outputLine = _.set(outputLine, '$remove', { [`posts.${postIndex}`]: postDelete })
                } else if (postId && !value && mentionId && !text && !postDelete && mentionDelete) {
                    outputLine = _.set(outputLine, '$remove', { [`${subdocument}.${postIndex}.mentions.${mentionIndex}`]: mentionDelete })
                } else {
                    outputLine = { "invalid operation": true }
                }
            }
            if (outputLine) {
                output = _.merge(output, outputLine)
            }
        })
    })
    return output
}



module.exports.generateUpdateStatement = generateUpdateStatement;
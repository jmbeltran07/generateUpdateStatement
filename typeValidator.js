const t = require('tcomb')

const Integer = t.refinement(t.Number, (n) => n % 1 === 0, 'Integer');

const Mentions = t.struct({
    '_id': t.maybe(t.Integer),
    'text': t.maybe(t.String),
    '_delete': t.maybe(t.Boolean)
})

const Posts = t.struct({
    '_id': t.maybe(t.Integer),
    'value': t.maybe(t.String),
    'mentions': t.maybe(t.list(Mentions)),
    '_delete': t.maybe(t.Boolean)
})

const Mutation = t.struct({
    'posts': t.list(Posts)
})

module.exports.Mutation = Mutation
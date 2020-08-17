const { generateUpdateStatement } = require('../generateUpdateStatement')
const {
    originalDocument,
    testingData,
    extraTestingData
} = require('./testingData')
const _ = require('lodash')

_.map(testingData, (testData) => {
    test(testData.testName, () => {
        const result = JSON.stringify(generateUpdateStatement(originalDocument, testData.input))
        const expected = JSON.stringify(testData.output)
        expect(result).toBe(expected)
    })
})

_.map(extraTestingData, (testData) => {
    test(testData.testName, () => {
        const result = JSON.stringify(generateUpdateStatement(originalDocument, testData.input))
        const expected = JSON.stringify(testData.output)
        expect(result).toBe(expected)
    })
})

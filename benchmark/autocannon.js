const { parseArgs } = require ('node:util');
const autocannon = require('autocannon')
const fs = require("fs");
const path = require('path')

const args = ['--option'];

const options = {
    option: {
        type: 'string',
        short: 'o'
    },
};

const {
    values,
    positionals
} = parseArgs({ options });

// async/await
async function runBenchmark () {
    const result = await autocannon({
        url: 'http://localhost:3001',
        connections: 100, //default
        pipelining: 1, // default
        duration: 10 // default
    })
    console.log(result)
    fs.writeFileSync(path.resolve(__dirname, `results-${values.option}.json`), JSON.stringify(result))
}

runBenchmark()

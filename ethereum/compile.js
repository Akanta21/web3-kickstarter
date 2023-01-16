const path = require('path')
const solc = require('solc')
const fs = require('fs-extra')

const buildPath = path.resolve(__dirname, 'build')

fs.removeSync(buildPath) // removal of build path

const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol')
const source = fs.readFileSync(campaignPath, 'utf8')

const input = {
  language: 'Solidity',
  sources: {
    Campaign: {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*'],
      },
    },
  },
}

const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts
console.log('output', output)

fs.ensureDirSync(buildPath) // create build folder

for (let contract in output.Campaign) {
  console.log(contract)
  fs.outputJsonSync(
    path.resolve(buildPath, contract + '.json'),
    output.Campaign[contract],
  )
}

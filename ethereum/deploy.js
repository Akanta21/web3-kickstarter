// deploy code will go here
require('dotenv').config()
const HDWalletProvider = require('@truffle/hdwallet-provider')
const Web3 = require('web3')
const compiledFactory = require('./build/CampaignFactory.json')

const { MNEMONIC, NETWORK } = process.env

console.log(process.env)

const provider = new HDWalletProvider(MNEMONIC, NETWORK)

const web3 = new Web3(provider)

// list account
const deploy = async () => {
  const accounts = await web3.eth.getAccounts()

  console.log('Attempting to deploy from account:', accounts[0])

  const contractAddress = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ gas: '5000000', from: accounts[0] })

  console.log('abi', compiledFactory.abi)
  console.log('contractAddress', contractAddress.options.address)
  provider.engine.stop()
}

// deploy
deploy()

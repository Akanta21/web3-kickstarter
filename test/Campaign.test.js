// contract test code will go here
const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')

const web3 = new Web3(ganache.provider())

const compiledFactory = require('../ethereum/build/CampaignFactory.json')
const compiledCampaign = require('../ethereum/build/Campaign.json')

let acc, accounts, factory, campaignAddress, campaign

beforeEach(async () => {
  // Get list of accounts
  accounts = await web3.eth.getAccounts()
  // Use one to deploy contract
  acc = accounts[0]

  factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ from: acc, gas: '5000000' })

  await factory.methods.createCampaign('100').send({
    from: acc,
    gas: '5000000',
  })

  const addresses = await factory.methods.getDeployedCampaigns().call()

  campaignAddress = addresses[0]

  campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress)
})

describe('Campaigns', () => {
  it('deploys a factory and a campaign', () => {
    assert.ok(factory.options.address)
    assert.ok(campaign.options.address)
  })

  it('marks caller as the campaign manager', async () => {
    const caller = await campaign.methods.manager().call()
    assert.equal(acc, caller)
  })

  it('can contribute to a campaign and marks them as approver', async () => {
    await campaign.methods.contribute().send({
      value: '200',
      from: accounts[1],
    })
    const isContributor = await campaign.methods.approvers(accounts[1]).call()

    assert.equal(isContributor, true)
  })

  it('requires a minimum contribution', async () => {
    try {
      await campaign.methods.contribute().send({
        value: '50',
        from: accounts[1],
      })
      assert(false)
    } catch (err) {
      assert(err)
    }
  })

  it('allows a manager to make a payment request', async () => {
    await campaign.methods
      .createRequest('Buy Batteries', '100', accounts[1])
      .send({
        from: accounts[0],
        gas: '5000000',
      })

    const request = await campaign.methods.requests(0).call()

    assert.equal('Buy Batteries', request.description)
  })

  it('processes requests', async () => {
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei('10', 'ether'),
    })

    await campaign.methods
      .createRequest('A', web3.utils.toWei('5', 'ether'), accounts[1])
      .send({
        from: accounts[0],
        gas: '5000000',
      })

    await campaign.methods.approveRequest(0).send({
      from: accounts[0],
      gas: '5000000',
    })

    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: '5000000',
    })

    let balance = await web3.eth.getBalance(accounts[1])

    balance = web3.utils.fromWei(balance, 'ether')

    balance = parseFloat(balance)

    console.log('balance', balance)

    assert(balance > 104)
  })
})

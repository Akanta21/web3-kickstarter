import web3 from '../web3'
import CampaignFactory from './build/CampaignFactory.json'

const instance = new web3.eth.Contract(
  CampaignFactory.abi,
  '0xb98fa317FAF87851E9c1f451B898002C58E3D4f0',
)

export default instance

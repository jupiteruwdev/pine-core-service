import _ from 'lodash'
import Web3 from 'web3'
import appConf from '../../app.conf'
import { Blockchain } from '../../entities'
import fault from '../../utils/fault'

const web3s: Record<string, Web3 | undefined> = {
  [Blockchain.Ethereum.Network.MAIN]: undefined,
  [Blockchain.Ethereum.Network.ROPSTEN]: undefined,
  [Blockchain.Ethereum.Network.RINKEBY]: undefined,
  [Blockchain.Ethereum.Network.GOERLI]: undefined,
  [Blockchain.Ethereum.Network.KOVAN]: undefined,
}

export function getEthWeb3(networkId: string = Blockchain.Ethereum.Network.MAIN) {
  if (web3s[networkId] !== undefined) return web3s[networkId] as Web3

  const rpc = _.get(appConf.ethRPC, networkId)

  if (!rpc) throw fault('ERR_ETH_UNSUPPORTED_RPC', `No RPC set up for network ID ${networkId}`)

  const web3 = new Web3(rpc)
  web3s[networkId] = web3

  return web3
}

export async function getEthBlockNumber(networkId: string = Blockchain.Ethereum.Network.MAIN): Promise<number> {
  const web3 = getEthWeb3(networkId)
  const blockNumber = await web3.eth.getBlockNumber()

  return blockNumber
}

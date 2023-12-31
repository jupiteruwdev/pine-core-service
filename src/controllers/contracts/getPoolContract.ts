import { Contract } from 'web3-eth-contract'
import ERC721LendingABI from '../../abis/ERC721Lending.json' assert { type: 'json' }
import ERC721LendingABIV2 from '../../abis/ERC721LendingV2.json' assert { type: 'json' }
import { Blockchain } from '../../entities'
import fault from '../../utils/fault'
import getEthWeb3 from '../utils/getEthWeb3'

type Params = {
  blockchain: Blockchain
  poolAddress: string
}

const ethPoolContracts: { [poolAddress: string]: VersionedContract } = {}

type VersionedContract = Contract & { poolVersion?: number }

export default async function getPoolContract({ blockchain, poolAddress }: Params): Promise<VersionedContract> {
  try {
    if (!Blockchain.isEVMChain(blockchain)) throw fault('ERR_UNSUPPORTED_BLOCKCHAIN')
    if (ethPoolContracts[poolAddress] && (ethPoolContracts[poolAddress].poolVersion ?? 0) > 0) {
      return ethPoolContracts[poolAddress]
    }
    const web3 = getEthWeb3(blockchain.networkId)
    const contractTest: VersionedContract = new web3.eth.Contract(ERC721LendingABIV2 as any, poolAddress)
    try {
      await contractTest.methods._controlPlane().call()
      contractTest.poolVersion = 2
      ethPoolContracts[poolAddress] = contractTest
      return contractTest
    }
    catch (e) {
      const contract: VersionedContract = new web3.eth.Contract(ERC721LendingABI as any, poolAddress)
      contract.poolVersion = 1
      ethPoolContracts[poolAddress] = contract
      return contract
    }
  }
  catch (err) {
    throw fault('ERR_GET_POOL_CONTRACT', undefined, err)
  }
}

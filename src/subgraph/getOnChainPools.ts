import { gql } from 'graphql-request'
import fault from '../utils/fault'
import getRequest, { Options } from './utils/getRequest'

type Params = {
  lenderAddress?: string
  address?: string
  excludeAddresses?: string[]
  collectionAddress?: string
}

export default async function getOnChainPools({ lenderAddress, address, excludeAddresses, collectionAddress }: Params, options: Options) {
  const request = getRequest(gql`
    query pools(${lenderAddress !== undefined ? '$lenderAddress: String' : ''}${address !== undefined ? ', $address: String' : ''}${excludeAddresses?.length ? ', $excludeAddresses: [String]' : ''}${collectionAddress?.length ? ', $collectionAddress: String' : ''}) {
      pools(where: {${lenderAddress !== undefined ? 'lenderAddress: $lenderAddress' : ''}${address !== undefined ? ', id: $address' : ''}${excludeAddresses?.length ? ', id_not_in: $excludeAddresses' : ''}${collectionAddress?.length ? ', collection: $collectionAddress' : ''}}) {
        id
        totalUtilization
        collection
        supportedCurrency
        target
        fundSource
        duration
        interestBPS1000000XBlock
        collateralFactorBPS
        lenderAddress
      }
    }
  `)

  return request({ lenderAddress: lenderAddress?.toLowerCase(), address: address?.toLowerCase(), excludeAddresses, collectionAddress: collectionAddress?.toLowerCase() }, options)
    .catch(err => {
      throw fault('ERR_GQL_BAD_REQUEST', undefined, err)
    })
}

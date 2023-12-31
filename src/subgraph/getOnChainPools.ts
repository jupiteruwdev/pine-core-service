import { gql } from 'graphql-request'
import fault from '../utils/fault'
import getRequest, { Options } from './utils/getRequest'

type Params = {
  lenderAddress?: string
  address?: string
  excludeAddresses?: string[]
  collectionAddress?: string
}

export default async function getOnChainPools({ lenderAddress, address, excludeAddresses, collectionAddress }: Params, { networkId, useCache }: Options = {}) {
  const values = lenderAddress || address || excludeAddresses || collectionAddress ? `(${lenderAddress !== undefined ? '$lenderAddress: String' : ''}${address !== undefined ? ', $address: String' : ''}${excludeAddresses?.length ? ', $excludeAddresses: [String]' : ''}${collectionAddress?.length ? ', $collectionAddress: String' : ''})` : ''
  const filters = lenderAddress || address || excludeAddresses || collectionAddress ? `(first: 1000, where: {${lenderAddress !== undefined ? 'lenderAddress: $lenderAddress' : ''}${address !== undefined ? ', id: $address' : ''}${excludeAddresses?.length ? ', id_not_in: $excludeAddresses' : ''}${collectionAddress?.length ? ', collection: $collectionAddress' : ''}})` : '(first: 1000)'

  const request = getRequest(gql`
    query pools${values} {
      pools${filters} {
        id
        totalUtilization
        collection
        supportedCurrency
        target
        fundSource
        duration
        maxLoanLimit
        interestBPS1000000XBlock
        collateralFactorBPS
        lenderAddress
        sftMarketId
      }
    }
  `)

  return request({
    lenderAddress: lenderAddress?.toLowerCase(),
    address: address?.toLowerCase(),
    excludeAddresses: excludeAddresses?.map(address => address.toLowerCase()),
    collectionAddress: collectionAddress?.toLowerCase(),
  }, { networkId, useCache })
    .catch(err => {
      throw fault('ERR_GQL_BAD_REQUEST', undefined, err)
    })
}

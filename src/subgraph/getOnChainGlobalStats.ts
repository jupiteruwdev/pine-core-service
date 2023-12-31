import { gql } from 'graphql-request'
import fault from '../utils/fault'
import getRequest, { Options } from './utils/getRequest'

export default async function getOnChainGlobalStats({ networkId, useCache }: Options = {}) {
  const request = getRequest(gql`
    query {
      globalStat(id: "1") {
        id
        historicalLentOut
      }
      loans (where: {status: "open"}, first: 1000) {
        id
        erc721
        pool
        
      }
    }
  `)

  return request({}, { networkId, useCache })
    .catch(err => {
      throw fault('ERR_GQL_BAD_REQUEST', undefined, err)
    })
}

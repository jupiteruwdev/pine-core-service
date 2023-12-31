import { gql } from 'graphql-request'
import fault from '../utils/fault'
import getRequest, { Options } from './utils/getRequest'

type Params = {
  loanId: string
}

export default async function getOnChainLoanById({ loanId }: Params, { networkId, useCache }: Options = {}): Promise<any> {
  const request = getRequest(gql`
    query loan($id: ID!) {
      loan(id: $id) {
        accuredInterestWei
        borrowedWei
        borrower
        erc721
        id
        interestBPS1000000XBlock
        loanExpiretimestamp
        loanStartBlock
        maxLTVBPS
        pool
        repaidInterestWei
        returnedWei
        status
      }
    }
  `)

  return request({ id: loanId.toLowerCase() }, { networkId, useCache })
    .then(res => res.loan)
    .catch(err => {
      throw fault('ERR_GQL_BAD_REQUEST', undefined, err)
    })
}

import { Router } from 'express'
import _ from 'lodash'
import { countLoans, getLoan, getLoansByBorrower, getLoansByCollection, isLoanExtendable, searchLoans } from '../../controllers'
import { LoanSortDirection, LoanSortType } from '../../controllers/loans/searchLoans'
import { Blockchain, Loan, Pagination, serializeEntityArray } from '../../entities'
import fault from '../../utils/fault'
import { isAddress } from '../../utils/web3'
import { getBlockchain, getBlockchainFilter, getNumber, getString } from '../utils/query'

const router = Router()

router.get('/nft', async (req, res, next) => {
  try {
    const nftId = getString(req.query, 'nftId')
    const collectionAddress = getString(req.query, 'collectionAddress')
    const txSpeedBlocks = _.toNumber(req.query.txSpeedBlocks ?? 0)
    const blockchain = getBlockchain(req.query)
    const loan = await getLoan({ blockchain, nftId, collectionAddress, txSpeedBlocks, populateValuation: true })

    if (loan === undefined) {
      res.status(404).send({ error: fault('ERR_API_FETCH_LOAN_NOT_FOUND') })
    }
    else {
      const payload = Loan.serialize(loan)
      res.status(200).json(payload)
    }
  }
  catch (err) {
    next(fault('ERR_API_FETCH_LOAN_BY_NFT', undefined, err))
  }
})

router.get('/nft/extendable', async (req, res, next) => {
  try {
    const nftId = getString(req.query, 'nftId')
    const collectionAddress = getString(req.query, 'collectionAddress')
    const blockchain = getBlockchain(req.query)
    const isExtendable = await isLoanExtendable({ blockchain, collectionAddress, nftId })
    const payload = { isExtendable }

    res.status(200).json(payload)
  }
  catch (err) {
    next(fault('ERR_API_EXTENDABLE', undefined, err))
  }
})

router.get('/borrower', async (req, res, next) => {
  try {
    const borrowerAddress = getString(req.query, 'borrowerAddress')
    const blockchain = getBlockchain(req.query)

    if (!isAddress(borrowerAddress)) {
      res.status(400).send({ error: (fault('INVALID_WALLET_ADDRESS')) })
    }
    else {
      const loans = await getLoansByBorrower({ blockchain, borrowerAddress, populateMetadata: true })
      const payload = serializeEntityArray(loans, Loan.codingResolver)

      res.status(200).json(payload)
    }

  }
  catch (err) {
    next(fault('ERR_API_FETCH_LOANS_BY_BORROWER', undefined, err))
  }
})

router.get('/collection', async (req, res, next) => {
  try {
    const collectionAddress = getString(req.query, 'collectionAddress')
    const blockchain = getBlockchain(req.query, { optional: true }) ?? Blockchain.Ethereum()
    const loans = await getLoansByCollection({ collectionAddress, blockchain, populateMetadata: true })
    const payload = serializeEntityArray(loans, Loan.codingResolver)
    res.status(200).json(payload)
  }
  catch (err) {
    next(fault('ERR_API_FETCH_LOANS_BY_COLLECTION', undefined, err))
  }
})

router.get('/search', async (req, res, next) => {
  try {
    const blockchainFilter = getBlockchainFilter(req.query, false)
    const collectionAddresses = getString(req.query, 'collectionAddresses', { optional: true })?.split(',')
    const lenderAddresses = getString(req.query, 'lenderAddresses', { optional: true })?.split(',')
    const collectionNames = getString(req.query, 'collectionNames', { optional: true })?.split(',')
    const sortByType = getString(req.query, 'sort', { optional: true }) as LoanSortType
    const sortByDirection = getString(req.query, 'direction', { optional: true }) as LoanSortDirection
    const sortBy = sortByType !== undefined ? { type: sortByType, direction: sortByDirection ?? LoanSortDirection.ASC } : undefined
    const paginateByOffset = getNumber(req.query, 'offset', { optional: true })
    const paginateByCount = getNumber(req.query, 'count', { optional: true })
    const paginateBy = paginateByOffset !== undefined && paginateByCount !== undefined ? { count: paginateByCount, offset: paginateByOffset } : undefined
    const [totalCount, loans] = await Promise.all([
      countLoans({ blockchainFilter, collectionAddresses, collectionNames, lenderAddresses }),
      searchLoans({
        blockchainFilter,
        collectionAddresses,
        collectionNames,
        lenderAddresses,
        sortBy,
        paginateBy,
      }),
    ])
    const nextOffset = (paginateBy?.offset ?? 0) + loans.length

    const pagination = Pagination.serialize({
      data: loans,
      totalCount,
      nextOffset: nextOffset === totalCount ? undefined : nextOffset,
    })
    res.status(200).json(pagination)
  }
  catch (err) {
    next(fault('ERR_API_SEARCH_LOANS', undefined, err))
  }
})

export default router

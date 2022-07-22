import _ from 'lodash'
import { Collection } from '../../entities'

export default function mapCollection(data: Record<string, any>): Collection {
  const address = _.get(data, 'address')
  const networkType = _.get(data, 'networkType')
  const networkId = _.toString(_.get(data, 'networkId'))
  const vendorIds = _.get(data, 'vendorIds')
  const imageUrl = _.get(data, 'imageUrl')
  const name = _.get(data, 'displayName')

  if (!_.isString(address)) throw TypeError('Failed to map key "address"')
  if (!_.isString(name)) throw TypeError('Failed to map key "name"')
  if (!networkType) throw TypeError('Failed to map key "blockchain"')
  if (!networkId) throw TypeError('Failed to map key "blockchain"')

  return {
    address,
    blockchain: { network: networkType, networkId },
    vendorIds,
    imageUrl,
    name,
  }
}

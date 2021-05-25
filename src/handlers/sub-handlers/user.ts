import { SubstrateExtrinsic } from '@subql/types'
import { resolveToken } from '../../helpers/token'
import { NftUser } from '../../types/models/NftUser'
import { Transfer } from "../../types/models/Transfer"
import { AnyCall } from '../types'
import { AccountHandler } from './account'

export class UserHandler {
  static async ensureUser (id: string) {
    const nftUser = await NftUser.get(id)

    if (!nftUser) {
      const nftUser = new NftUser(id)
      await nftUser.save()
    }
  }
}
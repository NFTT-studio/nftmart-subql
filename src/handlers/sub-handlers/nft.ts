import {SubstrateExtrinsic, SubstrateEvent} from '@subql/types';
import {Call} from '../../types/models/Call';
import {Class} from '../../types/models/Class';
import {Nft} from '../../types/models/Nft';
import {NftTransfer} from '../../types/models/NftTransfer';
import {NftEvent} from '../../types/models/NftEvent';
import {NftStatus} from '../../types/models/NftStatus';
import {CallHandler} from '../call';
import {ExtrinsicHandler} from '../extrinsic';
import {DispatchedCallData} from '../types';
import {AccountHandler} from './account';
import {hexToAscii} from '../../helpers/common';
import {getBlockTimestamp} from '../../helpers';
import {ClassHandler} from './class';
import {BadData} from '../../types/models/BadData';

export class NftHandler {
  // 4829-3, 4499-3: TransferredToken
  public static initialized: boolean = false;

  static async handleCallNftmartDoTransfer({id, call, extrinsic, isSuccess}: DispatchedCallData) {
    const args = call.args;

    const extrinsicHandler = new ExtrinsicHandler(extrinsic);

    const classId = args[0].toString();
    const tokenId = args[1].toString();
    const nftId = `${classId}-${tokenId}`;
    await ClassHandler.ensureClass(classId);
    await NftHandler.ensureNft(classId, tokenId);
    const price = (args[2] as any).toBigInt();
    const seller = args[3].toString();
    const buyer = extrinsicHandler.signer.toString();
    await AccountHandler.ensureAccount(seller);
    await AccountHandler.ensureAccount(buyer);

    const extrinsicHash = extrinsicHandler.id;

    const nftTransfer = new NftTransfer(nftId);

    nftTransfer.debug = `${nftId}`;

    nftTransfer.toId = buyer;
    nftTransfer.fromId = seller;
    nftTransfer.nftId = nftId;
    nftTransfer.extrinsicId = extrinsicHash;
    nftTransfer.timestamp = extrinsicHandler.timestamp;
    nftTransfer.isSuccess = isSuccess;
    nftTransfer.blockId = extrinsic?.block?.block?.header?.number?.toString();

    await nftTransfer.save();
  }

  static async ensureNftStatuses() {
    if (!this.initialized) {
      await NftHandler.ensureNftStatus('Idle');
      await NftHandler.ensureNftStatus('ForSale');
      await NftHandler.ensureNftStatus('AtAuction');
      await NftHandler.ensureNftStatus('Removed');
      this.initialized = true;
    }
  }

  static async ensureNft(classId: string, tokenId: string): Promise<void> {
    await ClassHandler.ensureClass(classId);

    const id = `${classId}-${tokenId}`;

    let nft = await Nft.get(id);

    await NftHandler.ensureNftStatuses();

    if (!nft) {
      nft = new Nft(id);
      nft.classId = classId;
      nft.tokenId = tokenId;
      await nft.save();
    }
  }

  static async ensureNftStatus(id: string) {
    const status = await NftStatus.get(id);
    if (!status) {
      const status = new NftStatus(id);
      await status.save();
    }
  }

  static async handleEventNftmartUpdatedToken(event: SubstrateEvent) {
    const {
      event: {
        data: [who, class_id, token_id],
      },
    } = event;
    const whoId = who.toString();
    let classId = class_id.toString();
    let tokenId = token_id.toString();
    let id = `${classId}-${tokenId}`;

    await NftHandler.ensureNft(classId, tokenId);

    console.log('UpdatedToken:', id);

    const origin = event.extrinsic?.extrinsic?.signer?.toString();
    // const Args = event.extrinsic?.extrinsic?.args;
    // console.log(Args.toString())
    const blockHash = event.extrinsic?.block?.block?.header?.hash?.toString();
    const blockHeight = event.extrinsic?.block?.block?.header?.number?.toString();
    const blockTimestamp = getBlockTimestamp(event.extrinsic?.block?.block);
    const eventIdx = event.idx.toString();
    const eventId = `${blockHeight}-${eventIdx}`;

    await AccountHandler.ensureAccount(who.toString());
    await ClassHandler.ensureClass(class_id.toString());

    const nft = await Nft.get(id);
    nft.classId = classId;
    nft.tokenId = tokenId;
    nft.quantity = 1;

    let tokendata = await api.query.ormlNFT.tokens(classId, tokenId);
    let metadataStr = '{}';
    /*
    {
      "metadata": "0x64656d6f206e6674206d65746164617461",
      "data": {
        "deposit": 11700000000,
        "createBlock": 15109,
        "royalty": true,
        "creator": "65ADzWZUAKXQGZVhQ7ebqRdqEzMEftKytB8a7rknW82EASXB",
        "royalty_beneficiary": "65ADzWZUAKXQGZVhQ7ebqRdqEzMEftKytB8a7rknW82EASXB"
      },
      "quantity": 20
    }
    */
    console.log('isEmpty:', tokendata.isEmpty);
    console.log((tokendata as any).toHuman());
    if (!tokendata.isEmpty) {
      let token = (tokendata as any).unwrap();
      nft.debug = JSON.stringify(token.toHuman());
      let quantity = token.quantity.toNumber();
      nft.royaltyRate = token.data.royalty_rate.toNumber();
      nft.deposit = token.data.deposit.toBigInt();
      // nft.metadata = metadataStr;
      let metadataStr = hexToAscii(token.metadata.toString());
      console.log('metadataStr', metadataStr);
      nft.metadata = await (async function () {
        try {
          return JSON.parse(metadataStr);
        } catch (e) {
          const badData = new BadData(`${blockHeight}-event-${id}`);
          badData.data = metadataStr;
          badData.reason = `${e}`;
          await badData.save();
        }
        return {};
      })();

      // console.log(token.data);
      nft.royaltyBeneficiaryId = token.data.royaltyBeneficiary.toString();
      nft.creatorId = token.data.creator.toString();
      // nft.ownerId = fromId;
      nft.eventId = eventId;
    }

    // console.log(metadataStr, chargeRoyalty);

    // nft.createBlockId = blockHeight;
    // nft.createTimestamp = blockTimestamp;
    nft.updateBlockId = blockHeight;
    nft.updateTimestamp = blockTimestamp;
    // nft.statusId = "Idle";

    nft.debug = `${event.event.section}.${event.event.method}`;

    await NftHandler.ensureNftStatuses();

    await nft.save();

    const nftEvent = new NftEvent(`${id}-${eventId}`);

    nftEvent.blockId = blockHeight;
    nftEvent.timestamp = blockTimestamp;
    nftEvent.fromId = who.toString();
    // nftEvent.toId = to.toString();
    nftEvent.price = BigInt(-1);
    nftEvent.params = `${event.event.data}`;

    nftEvent.nftId = id;
    nftEvent.eventId = eventId;
    nftEvent.quantity = 1;
    nftEvent.section = event.event.section;
    nftEvent.method = event.event.method;
    nftEvent.sectionMethod = `${event.event.section}.${event.event.method}`;
    await nftEvent.save();
  }

  static async handleEventNftmartMintedToken(event: SubstrateEvent) {
    // skip
    // can be inferred from the following events or corresponding calls that emit these events
    /*
		/// Transferred NFT token. \[from, to, class_id, token_id\]
		TransferredToken(T::AccountId, T::AccountId, ClassIdOf<T>, TokenIdOf<T>),
		/// Burned NFT token. \[owner, class_id, token_id\]
		BurnedToken(T::AccountId, ClassIdOf<T>, TokenIdOf<T>),
		/// Created a NFT Order. \[class_id, token_id, order_owner\]
		CreatedOrder(ClassIdOf<T>, TokenIdOf<T>, T::AccountId),
		/// Removed a NFT Order. \[class_id, token_id, order_owner, unreserved\]
		RemovedOrder(ClassIdOf<T>, TokenIdOf<T>, T::AccountId, Balance),
		/// An order had been taken. \[class_id, token_id, order_owner\]
		TakenOrder(ClassIdOf<T>, TokenIdOf<T>, T::AccountId),
		/// Price updated \[class_id, token_id, order_owner, price\]
		UpdatedOrderPrice(ClassIdOf<T>, TokenIdOf<T>, T::AccountId, Balance),
    */

    /* new master:

    /// nftmartConf

    /// Minted NFT token. \[from, to, class_id, token_id, quantity\]
		MintedToken(T::AccountId, T::AccountId, ClassIdOf<T>, TokenIdOf<T>, TokenIdOf<T>),
		/// Transferred NFT token. \[from, to, class_id, token_id, quantity\]
		TransferredToken(T::AccountId, T::AccountId, ClassIdOf<T>, TokenIdOf<T>, TokenIdOf<T>),
		/// Burned NFT token. \[owner, class_id, token_id, quantity, unreserved\]
		BurnedToken(T::AccountId, ClassIdOf<T>, TokenIdOf<T>, TokenIdOf<T>, Balance),

    mint()
    	to: <T::Lookup as StaticLookup>::Source,
			#[pallet::compact] class_id: ClassIdOf<T>,
			metadata: NFTMetadata,
			#[pallet::compact] quantity: TokenIdOf<T>,
			charge_royalty: Option<bool>,
    */

    const {
      event: {
        data: [who, to, class_id, token_id, quantity],
      },
    } = event;
    const whoId = who.toString();
    const toId = to.toString();
    let classId = class_id.toString();
    let tokenId = token_id.toString();
    let quant = Number(quantity.toString());
    let id = `${classId}-${tokenId}`;

    console.log('MintedToken:', id);

    const origin = event.extrinsic?.extrinsic?.signer?.toString();
    // const Args = event.extrinsic?.extrinsic?.args;
    // console.log(Args.toString())
    const blockHash = event.extrinsic?.block?.block?.header?.hash?.toString();
    const blockHeight = event.extrinsic?.block?.block?.header?.number?.toString();
    const blockTimestamp = getBlockTimestamp(event.extrinsic?.block?.block);
    const eventIdx = event.idx.toString();
    const eventId = `${blockHeight}-${eventIdx}`;

    await AccountHandler.ensureAccount(who.toString());
    await AccountHandler.ensureAccount(to.toString());
    await ClassHandler.ensureClass(class_id.toString());

    const nft = new Nft(id);
    nft.classId = classId;
    nft.tokenId = tokenId;

    let tokendata = await api.query.ormlNFT.tokens(classId, tokenId);
    let metadataStr = '{}';
    /*
    {
      "metadata": "0x64656d6f206e6674206d65746164617461",
      "data": {
        "deposit": 11700000000,
        "createBlock": 15109,
        "royalty": true,
        "creator": "65ADzWZUAKXQGZVhQ7ebqRdqEzMEftKytB8a7rknW82EASXB",
        "royalty_beneficiary": "65ADzWZUAKXQGZVhQ7ebqRdqEzMEftKytB8a7rknW82EASXB"
      },
      "quantity": 20
    }
    */
    console.log('isEmpty:', tokendata.isEmpty);
    console.log((tokendata as any).toHuman());
    if (!tokendata.isEmpty) {
      let token = (tokendata as any).unwrap();
      nft.debug = JSON.stringify(token.toHuman());
      let quantity = token.quantity.toNumber();
      nft.quantity = quantity;
      nft.royaltyRate = token.data.royalty_rate.toNumber();
      nft.deposit = token.data.deposit.toBigInt();
      // nft.metadata = metadataStr;
      let metadataStr = hexToAscii(token.metadata.toString());
      console.log('metadataStr', metadataStr);
      nft.metadata = await (async function () {
        try {
          return JSON.parse(metadataStr);
        } catch (e) {
          const badData = new BadData(`${blockHeight}-event-${id}`);
          badData.data = metadataStr;
          badData.reason = `${e}`;
          await badData.save();
        }
        return {};
      })();
    }

    // console.log(metadataStr, chargeRoyalty);

    nft.createBlockId = blockHeight;
    nft.createTimestamp = blockTimestamp;
    nft.updateBlockId = blockHeight;
    nft.updateTimestamp = blockTimestamp;
    nft.statusId = 'Idle';

    nft.royaltyBeneficiaryId = toId;
    nft.creatorId = toId;
    nft.ownerId = toId;
    nft.eventId = eventId;

    await NftHandler.ensureNftStatuses();

    await nft.save();

    const nftEvent = new NftEvent(`${id}-${eventId}`);

    nftEvent.blockId = blockHeight;
    nftEvent.timestamp = blockTimestamp;
    // nftEvent.fromId = who.toString();
    nftEvent.toId = to.toString();
    nftEvent.price = BigInt(-1);
    nftEvent.params = `${event.event.data}`;

    nftEvent.nftId = id;
    nftEvent.eventId = eventId;
    nftEvent.quantity = 1;
    nftEvent.section = event.event.section;
    nftEvent.method = event.event.method;
    nftEvent.sectionMethod = `${event.event.section}.${event.event.method}`;
    await nftEvent.save();
  }

  static async handleEventNftmartTransferredToken(event: SubstrateEvent) {
    const {
      event: {
        data: [who, to, class_id, token_id, quantity],
      },
    } = event;
    let classId = class_id.toString();
    let tokenId = token_id.toString();
    let nftId = `${classId}-${tokenId}`;
    let quant = Number(quantity.toString());

    const origin = event.extrinsic?.extrinsic?.signer?.toString();
    const args = event.extrinsic?.extrinsic?.method.args;
    const blockHeight = event.extrinsic?.block?.block?.header?.number?.toString();
    const blockTimestamp = getBlockTimestamp(event.extrinsic?.block?.block);
    const eventIdx = event.idx.toString();
    const eventId = `${blockHeight}-${eventIdx}`;

    await AccountHandler.ensureAccount(who.toString());
    await AccountHandler.ensureAccount(to.toString());
    await ClassHandler.ensureClass(class_id.toString());
    await NftHandler.ensureNft(classId, tokenId);

    const nft = await Nft.get(nftId);
    nft.ownerId = to.toString();

    await NftHandler.ensureNftStatuses();

    nft.updateBlockId = blockHeight;
    nft.updateTimestamp = blockTimestamp;
    nft.debug = `${event.event.section}.${event.event.method}`;
    await nft.save();

    const nftEvent = new NftEvent(`${nftId}-${eventId}`);

    nftEvent.blockId = blockHeight;
    nftEvent.timestamp = blockTimestamp;
    nftEvent.fromId = who.toString();
    nftEvent.toId = to.toString();
    nftEvent.price = BigInt(-1);
    nftEvent.params = `${event.event.data}`;

    nftEvent.nftId = nftId;
    nftEvent.eventId = eventId;
    nftEvent.quantity = 1;
    nftEvent.section = event.event.section;
    nftEvent.method = event.event.method;
    nftEvent.sectionMethod = `${event.event.section}.${event.event.method}`;
    await nftEvent.save();
  }

  static async handleEventNftmartBurnedToken(event: SubstrateEvent) {
    const {
      event: {
        data: [who, class_id, token_id, quantity, deposit],
      },
    } = event;
    let classId = class_id.toString();
    let tokenId = token_id.toString();
    let nftId = `${classId}-${tokenId}`;
    let quant = Number(quantity.toString());
    let depos = Number(deposit.toString());

    const origin = event.extrinsic?.extrinsic?.signer?.toString();
    const args = event.extrinsic?.extrinsic?.method.args;
    const blockHeight = event.extrinsic?.block?.block?.header?.number?.toString();
    const blockTimestamp = getBlockTimestamp(event.extrinsic?.block?.block);
    const eventIdx = event.idx.toString();
    const eventId = `${blockHeight}-${eventIdx}`;

    await AccountHandler.ensureAccount(who.toString());
    await ClassHandler.ensureClass(classId);
    await NftHandler.ensureNft(classId, tokenId);

    const nft = await Nft.get(nftId);
    nft.burned = true;

    nft.statusId = 'Removed';
    nft.updateBlockId = blockHeight;
    nft.updateTimestamp = blockTimestamp;
    nft.price = BigInt(-1);

    nft.debug = `${event.event.section}.${event.event.method}`;

    await NftHandler.ensureNftStatuses();

    await nft.save();

    const nftEvent = new NftEvent(`${nftId}-${eventId}`);

    nftEvent.blockId = blockHeight;
    nftEvent.timestamp = blockTimestamp;
    nftEvent.fromId = who.toString();
    nftEvent.price = BigInt(-1);
    nftEvent.params = `${event.event.data}`;

    nftEvent.nftId = nftId;
    nftEvent.eventId = eventId;
    nftEvent.quantity = 1;
    nftEvent.section = event.event.section;
    nftEvent.method = event.event.method;
    nftEvent.sectionMethod = `${event.event.section}.${event.event.method}`;
    await nftEvent.save();
  }
}

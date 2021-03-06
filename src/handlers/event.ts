import {SubstrateEvent} from '@subql/types';
import {Event} from '../types/models/Event';
import {BlockHandler} from './block';
import {ExtrinsicHandler} from './extrinsic';
import {Dispatcher} from '../helpers/dispatcher';
import {AccountHandler} from './sub-handlers/account';
import {TransferHandler} from './sub-handlers/transfer';
import {CategoryHandler} from './sub-handlers/category';
import {ClassHandler} from './sub-handlers/class';
import {NftHandler} from './sub-handlers/nft';
import {OrderHandler} from './sub-handlers/order';
import {AuctionHandler} from './sub-handlers/auction';

type EventDispatch = Dispatcher<SubstrateEvent>;

export class EventHandler {
  private event: SubstrateEvent;
  private dispatcher: EventDispatch;

  constructor(event: SubstrateEvent) {
    this.event = event;
    this.dispatcher = new Dispatcher<SubstrateEvent>();

    this.registerDispatcherHandler();
  }

  private registerDispatcherHandler() {
    this.dispatcher.batchRegist([
      /*
      {
        key: 'system-NewAccount',
        handler: AddressHandler.handleEventSystemNewAccount
      },
      */
      {
        key: 'nftmartConf-CreatedCategory',
        handler: CategoryHandler.handleEventNftmartCreatedCategory,
      },
      {
        key: 'nftmartConf-UpdatedCategory',
        handler: CategoryHandler.handleEventNftmartUpdatedCategory,
      },
      /*
      {
        key: "nftmartConf-AddWhitelist",
        handler: AccountHandler.handleEventNftmartAddWhitelist
      },
      {
        key: "nftmartConf-RemoveWhitelist",
        handler: AccountHandler.handleEventNftmartRemoveWhitelist
      },
      */
      {
        key: 'nftmart-CreatedClass',
        handler: ClassHandler.handleEventNftmartCreatedClass,
      },
      {
        key: 'nftmart-UpdatedClass',
        handler: ClassHandler.handleEventNftmartUpdatedClass,
      },
      {
        key: 'nftmart-DestroyedClass',
        handler: ClassHandler.handleEventNftmartDestroyedClass,
      },
      {
        key: 'nftmart-MintedToken',
        handler: NftHandler.handleEventNftmartMintedToken,
      },
      {
        key: 'nftmart-UpdatedToken',
        handler: NftHandler.handleEventNftmartUpdatedToken,
      },
      {
        key: 'nftmart-UpdatedTokenMetadata',
        handler: NftHandler.handleEventNftmartUpdatedToken,
      },
      {
        key: 'nftmart-UpdatedTokenRoyalty',
        handler: NftHandler.handleEventNftmartUpdatedToken,
      },
      {
        key: 'nftmart-UpdatedTokenRoyaltyBeneficiary',
        handler: NftHandler.handleEventNftmartUpdatedToken,
      },
      {
        key: 'nftmart-TransferredToken',
        handler: NftHandler.handleEventNftmartTransferredToken,
      },
      {
        key: 'nftmart-BurnedToken',
        handler: NftHandler.handleEventNftmartBurnedToken,
      },
      {
        key: 'nftmartOrder-CreatedOrder',
        handler: OrderHandler.handleEventNftmartCreatedOrder,
      },
      {
        key: 'nftmartOrder-CreatedOrder',
        handler: OrderHandler.handleEventNftmartCreatedOrder2,
      },
      {
        key: 'nftmartOrder-TakenOrder',
        handler: OrderHandler.handleEventNftmartTakenOrder,
      },
      {
        key: 'nftmartOrder-RemovedOrder',
        handler: OrderHandler.handleEventNftmartRemovedOrder,
      },
      {
        key: 'nftmartOrder-CreatedOffer',
        handler: OrderHandler.handleEventNftmartCreatedOffer,
      },
      {
        key: 'nftmartOrder-TakenOffer',
        handler: OrderHandler.handleEventNftmartTakenOffer,
      },
      {
        key: 'nftmartOrder-RemovedOffer',
        handler: OrderHandler.handleEventNftmartRemovedOffer,
      },
      /* auctions */
      {
        key: 'nftmartAuction-CreatedBritishAuction',
        handler: AuctionHandler.handleEventNftmartCreatedBritishAuction,
      },
      {
        key: 'nftmartAuction-RemovedBritishAuction',
        handler: AuctionHandler.handleEventNftmartRemovedBritishAuction,
      },
      {
        key: 'nftmartAuction-RedeemedBritishAuction',
        handler: AuctionHandler.handleEventNftmartRedeemedBritishAuction,
      },
      {
        key: 'nftmartAuction-BidBritishAuction',
        handler: AuctionHandler.handleEventNftmartBidBritishAuction,
      },
      {
        key: 'nftmartAuction-HammerBritishAuction',
        handler: AuctionHandler.handleEventNftmartHammerBritishAuction,
      },
      {
        key: 'nftmartAuction-CreatedDutchAuction',
        handler: AuctionHandler.handleEventNftmartCreatedDutchAuction,
      },
      {
        key: 'nftmartAuction-RemovedDutchAuction',
        handler: AuctionHandler.handleEventNftmartRemovedDutchAuction,
      },
      {
        key: 'nftmartAuction-RedeemedDutchAuction',
        handler: AuctionHandler.handleEventNftmartRedeemedDutchAuction,
      },
      {
        key: 'nftmartAuction-BidDutchAuction',
        handler: AuctionHandler.handleEventNftmartBidDutchAuction,
      },
    ]);
  }

  get index() {
    return this.event.idx;
  }

  get blockNumber() {
    return this.event.block.block.header.number.toBigInt();
  }

  get blockHash() {
    return this.event.block.block.hash.toString();
  }

  get section() {
    return this.event.event.section;
  }

  get method() {
    return this.event.event.method;
  }

  get data() {
    return this.event.event.data.toString();
  }

  get extrinsicHash() {
    const i = this.event?.extrinsic?.extrinsic?.hash?.toString();

    return i === 'null' ? undefined : i;
  }

  get extrinsicId() {
    return `${this.blockNumber.toString()}-${this.event?.extrinsic?.idx?.toString()}`;
  }

  get id() {
    return `${this.blockNumber.toString()}-${this.index}`;
  }

  public async save() {
    const event = new Event(this.id);

    await BlockHandler.ensureBlock(`${this.blockNumber.toString()}`);

    if (this.extrinsicHash) {
      await ExtrinsicHandler.ensureExtrinsic(this.extrinsicId);
    }

    event.index = this.index;
    event.section = this.section;
    event.method = this.method;
    event.data = this.data;

    event.blockId = this.blockNumber.toString();

    if (this.extrinsicHash) {
      event.extrinsicId = this.extrinsicId;
    }

    await event.save();

    await this.dispatcher.dispatch(`${this.section}-${this.method}`, this.event);
  }
}

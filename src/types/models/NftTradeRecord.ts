// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';


export class NftTradeRecord implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public nft_id?: string;

    public nftId?: string;

    public type?: number;

    public block_height?: string;

    public block_hash?: string;

    public token?: string;

    public price?: string;

    public buyerId?: string;

    public sellerId?: string;

    public direction?: number;

    public status?: number;

    public trade_id?: string;

    public created_at?: Date;

    public updated_at?: Date;

    public deleted_at?: Date;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save NftTradeRecord entity without an ID");
        await store.set('NftTradeRecord', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove NftTradeRecord entity without an ID");
        await store.remove('NftTradeRecord', id.toString());
    }

    static async get(id:string): Promise<NftTradeRecord | undefined>{
        assert((id !== null && id !== undefined), "Cannot get NftTradeRecord entity without an ID");
        const record = await store.get('NftTradeRecord', id.toString());
        if (record){
            return NftTradeRecord.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new NftTradeRecord(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

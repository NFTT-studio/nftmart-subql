// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';


export class NfRebateRecord implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public tradeId?: string;

    public userId?: string;

    public nftId?: string;

    public token?: string;

    public fee?: string;

    public rate?: string;

    public created_at?: Date;

    public updated_at?: Date;

    public deleted_at?: Date;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save NfRebateRecord entity without an ID");
        await store.set('NfRebateRecord', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove NfRebateRecord entity without an ID");
        await store.remove('NfRebateRecord', id.toString());
    }

    static async get(id:string): Promise<NfRebateRecord | undefined>{
        assert((id !== null && id !== undefined), "Cannot get NfRebateRecord entity without an ID");
        const record = await store.get('NfRebateRecord', id.toString());
        if (record){
            return NfRebateRecord.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new NfRebateRecord(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

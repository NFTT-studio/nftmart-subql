// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';


export class NfTradeTaxRecord implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public tradeId?: string;

    public nftId?: string;

    public token?: string;

    public fee?: string;

    public rate?: string;

    public created_at?: Date;

    public updated_at?: Date;

    public deleted_at?: Date;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save NfTradeTaxRecord entity without an ID");
        await store.set('NfTradeTaxRecord', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove NfTradeTaxRecord entity without an ID");
        await store.remove('NfTradeTaxRecord', id.toString());
    }

    static async get(id:string): Promise<NfTradeTaxRecord | undefined>{
        assert((id !== null && id !== undefined), "Cannot get NfTradeTaxRecord entity without an ID");
        const record = await store.get('NfTradeTaxRecord', id.toString());
        if (record){
            return NfTradeTaxRecord.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new NfTradeTaxRecord(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

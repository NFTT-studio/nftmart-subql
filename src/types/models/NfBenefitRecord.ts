// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';


export class NfBenefitRecord implements Entity {

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
        assert(id !== null, "Cannot save NfBenefitRecord entity without an ID");
        await store.set('NfBenefitRecord', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove NfBenefitRecord entity without an ID");
        await store.remove('NfBenefitRecord', id.toString());
    }

    static async get(id:string): Promise<NfBenefitRecord | undefined>{
        assert((id !== null && id !== undefined), "Cannot get NfBenefitRecord entity without an ID");
        const record = await store.get('NfBenefitRecord', id.toString());
        if (record){
            return NfBenefitRecord.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new NfBenefitRecord(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

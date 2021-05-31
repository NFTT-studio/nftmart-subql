// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';


export class NfBrowseRecord implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public nftId?: string;

    public token?: string;

    public created_at?: Date;

    public updated_at?: Date;

    public deleted_at?: Date;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save NfBrowseRecord entity without an ID");
        await store.set('NfBrowseRecord', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove NfBrowseRecord entity without an ID");
        await store.remove('NfBrowseRecord', id.toString());
    }

    static async get(id:string): Promise<NfBrowseRecord | undefined>{
        assert((id !== null && id !== undefined), "Cannot get NfBrowseRecord entity without an ID");
        const record = await store.get('NfBrowseRecord', id.toString());
        if (record){
            return NfBrowseRecord.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new NfBrowseRecord(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

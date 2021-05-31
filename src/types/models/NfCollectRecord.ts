// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';


export class NfCollectRecord implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public userId?: string;

    public nftId?: string;

    public created_at?: Date;

    public updated_at?: Date;

    public deleted_at?: Date;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save NfCollectRecord entity without an ID");
        await store.set('NfCollectRecord', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove NfCollectRecord entity without an ID");
        await store.remove('NfCollectRecord', id.toString());
    }

    static async get(id:string): Promise<NfCollectRecord | undefined>{
        assert((id !== null && id !== undefined), "Cannot get NfCollectRecord entity without an ID");
        const record = await store.get('NfCollectRecord', id.toString());
        if (record){
            return NfCollectRecord.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new NfCollectRecord(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

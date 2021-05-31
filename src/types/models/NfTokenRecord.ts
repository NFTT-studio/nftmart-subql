// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';


export class NfTokenRecord implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public userId?: string;

    public token?: string;

    public amount?: string;

    public type?: number;

    public created_at?: Date;

    public updated_at?: Date;

    public deleted_at?: Date;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save NfTokenRecord entity without an ID");
        await store.set('NfTokenRecord', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove NfTokenRecord entity without an ID");
        await store.remove('NfTokenRecord', id.toString());
    }

    static async get(id:string): Promise<NfTokenRecord | undefined>{
        assert((id !== null && id !== undefined), "Cannot get NfTokenRecord entity without an ID");
        const record = await store.get('NfTokenRecord', id.toString());
        if (record){
            return NfTokenRecord.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new NfTokenRecord(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';


export class NftClass implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public name?: string;

    public logo?: string;

    public feature?: string;

    public description?: string;

    public address?: string;

    public metadata: string;

    public authentication?: number;

    public royalty?: number;

    public owner?: string;

    public admins?: string;

    public created_at?: Date;

    public updated_at?: Date;

    public deleted_at?: Date;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save NftClass entity without an ID");
        await store.set('NftClass', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove NftClass entity without an ID");
        await store.remove('NftClass', id.toString());
    }

    static async get(id:string): Promise<NftClass | undefined>{
        assert((id !== null && id !== undefined), "Cannot get NftClass entity without an ID");
        const record = await store.get('NftClass', id.toString());
        if (record){
            return NftClass.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new NftClass(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';


export class NftCategory implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public name?: string;

    public created_at?: Date;

    public updated_at?: Date;

    public deleted_at?: Date;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save NftCategory entity without an ID");
        await store.set('NftCategory', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove NftCategory entity without an ID");
        await store.remove('NftCategory', id.toString());
    }

    static async get(id:string): Promise<NftCategory | undefined>{
        assert((id !== null && id !== undefined), "Cannot get NftCategory entity without an ID");
        const record = await store.get('NftCategory', id.toString());
        if (record){
            return NftCategory.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new NftCategory(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

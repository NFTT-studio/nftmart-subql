// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';

import {
    Metadata,
} from '../interfaces'


export class NftNft implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public token_id?: string;

    public classId?: string;

    public file_type?: number;

    public cid?: string;

    public metadata?: Metadata;

    public authentication?: number;

    public royalty?: number;

    public userId?: string;

    public creater?: string;

    public status?: string;

    public category_id?: number;

    public created_at?: Date;

    public updated_at?: Date;

    public deleted_at?: Date;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save NftNft entity without an ID");
        await store.set('NftNft', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove NftNft entity without an ID");
        await store.remove('NftNft', id.toString());
    }

    static async get(id:string): Promise<NftNft | undefined>{
        assert((id !== null && id !== undefined), "Cannot get NftNft entity without an ID");
        const record = await store.get('NftNft', id.toString());
        if (record){
            return NftNft.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new NftNft(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

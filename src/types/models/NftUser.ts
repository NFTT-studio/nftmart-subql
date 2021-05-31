// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';


export class NftUser implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public description?: string;

    public avatar?: string;

    public nickname?: string;

    public media?: string;

    public feature?: string;

    public last_login_time?: Date;

    public last_login_ip?: string;

    public login_times?: number;

    public created_at?: Date;

    public updated_at?: Date;

    public deleted_at?: Date;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save NftUser entity without an ID");
        await store.set('NftUser', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove NftUser entity without an ID");
        await store.remove('NftUser', id.toString());
    }

    static async get(id:string): Promise<NftUser | undefined>{
        assert((id !== null && id !== undefined), "Cannot get NftUser entity without an ID");
        const record = await store.get('NftUser', id.toString());
        if (record){
            return NftUser.create(record);
        }else{
            return;
        }
    }



    static create(record){
        let entity = new NftUser(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

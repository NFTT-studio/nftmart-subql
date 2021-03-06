// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';




type NftStatusProps = Omit<NftStatus, NonNullable<FunctionPropertyNames<NftStatus>>>;

export class NftStatus implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save NftStatus entity without an ID");
        await store.set('NftStatus', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove NftStatus entity without an ID");
        await store.remove('NftStatus', id.toString());
    }

    static async get(id:string): Promise<NftStatus | undefined>{
        assert((id !== null && id !== undefined), "Cannot get NftStatus entity without an ID");
        const record = await store.get('NftStatus', id.toString());
        if (record){
            return NftStatus.create(record as NftStatusProps);
        }else{
            return;
        }
    }



    static create(record: NftStatusProps): NftStatus {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new NftStatus(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

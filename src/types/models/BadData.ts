// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';




type BadDataProps = Omit<BadData, NonNullable<FunctionPropertyNames<BadData>>>;

export class BadData implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public data?: string;

    public reason?: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save BadData entity without an ID");
        await store.set('BadData', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove BadData entity without an ID");
        await store.remove('BadData', id.toString());
    }

    static async get(id:string): Promise<BadData | undefined>{
        assert((id !== null && id !== undefined), "Cannot get BadData entity without an ID");
        const record = await store.get('BadData', id.toString());
        if (record){
            return BadData.create(record as BadDataProps);
        }else{
            return;
        }
    }



    static create(record: BadDataProps): BadData {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new BadData(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

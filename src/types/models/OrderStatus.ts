// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';




type OrderStatusProps = Omit<OrderStatus, NonNullable<FunctionPropertyNames<OrderStatus>>>;

export class OrderStatus implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save OrderStatus entity without an ID");
        await store.set('OrderStatus', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove OrderStatus entity without an ID");
        await store.remove('OrderStatus', id.toString());
    }

    static async get(id:string): Promise<OrderStatus | undefined>{
        assert((id !== null && id !== undefined), "Cannot get OrderStatus entity without an ID");
        const record = await store.get('OrderStatus', id.toString());
        if (record){
            return OrderStatus.create(record as OrderStatusProps);
        }else{
            return;
        }
    }



    static create(record: OrderStatusProps): OrderStatus {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new OrderStatus(record.id);
        Object.assign(entity,record);
        return entity;
    }
}

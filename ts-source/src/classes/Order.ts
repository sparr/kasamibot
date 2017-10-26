import {Priority} from "../enums/priority";
import {Role} from "../enums/role";

export class Order {
    public priority: Priority;
    public body: string[];
    public memory: {
        role: Role,
        tier: number,
        target?: string,
        targets?: string[],
        route?: string[],
        boost?: string[],
        homeroom?: string,
        token?: string,
    };
    public twinOrder?: Order;
}

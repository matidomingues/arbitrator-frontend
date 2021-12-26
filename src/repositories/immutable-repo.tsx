import { ImmutableApi } from "../api/immutable-api";
import { CardResponse, IImmutableApi, Tokens } from "../api/interfaces";

export class ImmutableRepo {

    constructor(private immutableApi: IImmutableApi) {
    }

    fetchOrders(cardName: string, token: Tokens): Promise<CardResponse[]> {
        console.log('fetchOrders');
        return this.immutableApi.fetchOrders(cardName, token).then(response => response.result.filter(card => card.sell.data.properties.collection.name === "Gods Unchained"));
    }
}
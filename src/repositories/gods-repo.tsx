import { GodsApi } from "../api/gods-api";
import { Card } from "./interfaces";

export class GodsRepo {
    constructor(private godsApi: GodsApi){
    }

    getCard(cardId: number): Promise<Card> {
        return this.godsApi.getCard(cardId).then(response => { return {id: response.id, variation: '4', name: response.name}});
    }
}
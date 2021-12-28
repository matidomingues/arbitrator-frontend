import { ICoinPrice, Tokens } from "../api/interfaces";
import { PriceApi } from "../api/price-api";

export class PriceRepo {

    constructor(private priceApi: PriceApi) {
    }

    getTokensPrice(tokens: Tokens[]): Promise<ICoinPrice> {
        return this.priceApi.getTokensPrice(tokens);
    }
}
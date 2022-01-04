import { ICoinPrice, Tokens } from "./interfaces";

export class PriceApi {
    getTokensPrice(tokens: Tokens[]): Promise<ICoinPrice> {
        const url = this.prepareCoinGeckoUrl(tokens);
        return fetch(url).then(response => response.json());
    }


    prepareCoinGeckoUrl = (tokens: Tokens[]) => {
        const url = new URL('https://api.coingecko.com/api/v3/simple/price');
        url.searchParams.append('vs_currencies', 'usd');
        let currencies: string[] = [];
        tokens.forEach(token => {
            switch(token) {
                case Tokens.ETH: ; currencies.push('ethereum');break;
                case Tokens.GODS: currencies.push('gods-unchained'); break;
                case Tokens.IMX: currencies.push('immutable-x'); break;
            }
        });
        url.searchParams.append('ids', currencies.join(','));
        return url.toString();
    }
}
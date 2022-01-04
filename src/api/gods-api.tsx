export class GodsApi {

    getCard(cardId: number) {
        return fetch(`https://api.godsunchained.com/v0/proto/${cardId}`).then(result => result.json());
    }
}
import React, { Component, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { ImmutableApi } from './api/immutable-api';
import { ImmutableRepo } from './repositories/immutable-repo';
import { Tokens } from './api/interfaces';
import { TaskQueue } from './components/task-queue/task-queue';

export class App extends Component<{},{ethPrice: number, godsPrice: number, cardResponses: {[cardId: string]: {name: string, id: number, variation: number, gods: number, eth: number}}, trackedCards: string[] }> {

  private immutableTaskQueue?: TaskQueue ;

  constructor(props: any) {
    super(props);
    const savedTrackedCards = window.sessionStorage.getItem('savedTrackedCards') || '[]';
    this.state = ({ethPrice: 4095.21, godsPrice: 5.58, cardResponses: {}, trackedCards: JSON.parse(savedTrackedCards)});    
  }

  componentDidMount() {
    this.immutableTaskQueue = new TaskQueue(1, 200);
    this.state.trackedCards.filter(card => !!card).forEach(cardName => this.fetchOrders(cardName));
  }


  private cardToAdd = '';
  private immutableRepo = new ImmutableRepo(new ImmutableApi());

  fetchOrder = (cardName: string, token: Tokens) =>
   this.immutableRepo.fetchOrders(cardName, token).then(cards => {
      cards.forEach(card => {

        const cardUrl = new URL(card.sell.data.properties.image_url);

        const cardId = cardUrl.searchParams.get('id');
        const cardVariation = cardUrl.searchParams.get('q');

        const cardKey = `${cardId}-${cardVariation}`;
        const currentCard = this.state.cardResponses[cardKey] || {name: card.sell.data.properties.name, id: cardId, variation: cardVariation};

        const price = card.buy.data.quantity/(Math.pow(10,card.buy.data.decimals))

        if(token === Tokens.ETH && (!currentCard.eth || currentCard.eth > price)) {
          currentCard.eth = price;
        } else if (token === Tokens.GODS &&  (!currentCard.gods || currentCard.gods > price)) {
          currentCard.gods = price;
        }

        this.setState({
          ...this.state,
          cardResponses: {
            ...this.state.cardResponses,
            [cardKey]: currentCard
          }
        })
      })
  })

  fetchOrders = (cardName: string) => {
    console.log('called');
    if(this.immutableTaskQueue){
      this.immutableTaskQueue.addTask(() => this.fetchOrder(cardName, Tokens.ETH));
      this.immutableTaskQueue.addTask(() => this.fetchOrder(cardName, Tokens.GODS));
    } else{
      console.log('no queue');
    }
  }

  trackCard = (cardName: string) => {
    this.setState({
      ...this.state,
      trackedCards: [
        ...this.state.trackedCards,
        cardName
      ]
    });

    window.sessionStorage.setItem('savedTrackedCards', JSON.stringify([...this.state.trackedCards, cardName]));
    this.fetchOrders(cardName);
  }

  untrackCard = (cardName: string) => {
    const newArray = this.state.trackedCards.filter(card => card !== cardName);
    this.setState({
      ...this.state,
      trackedCards: newArray
    })
    window.sessionStorage.setItem('savedTrackedCards', JSON.stringify(newArray));
  }

  render () {
    return (
      <div className="App">
        <div className='Sidebar'>
          <p>Cards Tracked</p>
            <div>
              <input onChange={(e) => this.cardToAdd = e.target.value} />
              <button onClick={() => this.trackCard(this.cardToAdd)}>Add</button>
            </div>
              {this.state.trackedCards.map(tracked => <span onClick={() => this.untrackCard(tracked)}>{tracked}</span>)}
        </div>
        <div>
          ETH Price:
          <input value={this.state.ethPrice} onChange={(e) => this.setState({...this.state, ethPrice: parseFloat(e.target.value) })} />
          GODS Price:
          <input value={this.state.godsPrice} onChange={(e) => this.setState({...this.state, godsPrice: parseFloat(e.target.value) })} />
          <table>
            <tr>
              <th>Name</th>
              <th>ID</th>
              <th>Variation</th>
              <th>Price ETH</th>
              <th>Price GODS</th>
              <th>Difference</th>
            </tr>
            {Object.keys(this.state.cardResponses).map(cardKey => {
              const card = this.state.cardResponses[cardKey];
              return (
                <tr>
                  <td>{card.name}</td>
                  <td>{card.id}</td>
                  <td>{card.variation}</td>
                  <td>{card.eth * this.state.ethPrice} ({card.eth})</td>
                  <td>{card.gods * this.state.godsPrice} ({card.gods})</td>
                  <td>{(((card.gods * this.state.godsPrice)-(card.eth * this.state.ethPrice))/(card.eth * this.state.ethPrice)) * 100}</td>
                </tr>
              )
            })}
          </table>
        </div>
      </div>
    );
  }
}

export default App;

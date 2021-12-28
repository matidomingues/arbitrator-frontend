import React, { Component, useState } from 'react';
import './price-comparer.css';
import { ImmutableApi } from '../../api/immutable-api';
import { ImmutableRepo } from '../../repositories/immutable-repo';
import { Tokens } from '../../api/interfaces';
import { TaskQueue } from '../../components/task-queue/task-queue';
import { CardsFilter } from '../../components/cards-filter/cards-filter';
import { PriceRepo } from '../../repositories/price-repo';
import { PriceApi } from '../../api/price-api';
import { Card } from '../../repositories/interfaces';
import { Link, NavigateFunction, useNavigate, useOutletContext } from 'react-router-dom';

interface IState {
  ethPrice: number, 
  godsPrice: number, 
  priceList: {[cardId: string]: {minGodsPrice: number, minEthPrice: number}}, 
  cardList: {[cardId:string]: Card},
  trackedCards: {cardId: number, variation: number, cardName: string}[]
}

interface IProps {
  immutableRepo: ImmutableRepo;
  priceRepo: PriceRepo;
  navigate?: NavigateFunction;
}

class PriceComparerWrapped extends Component<IProps,IState> {

  constructor(props: any) {
    super(props);
    let savedTrackedCards = JSON.parse(window.sessionStorage.getItem('savedTrackedCards') || '[]');
    if (savedTrackedCards.length > 0 && !savedTrackedCards[0].cardId) {
      window.sessionStorage.setItem('savedTrackedCards', '[]');
      savedTrackedCards = [];
    }
    this.state = ({ethPrice: 0, godsPrice: 0, priceList: {}, cardList: {}, trackedCards: savedTrackedCards});    
  }

  componentDidMount() {
    this.state.trackedCards.forEach(card => this.fetchOrders(card.cardId));
    this.props.priceRepo.getTokensPrice([Tokens.ETH, Tokens.GODS]).then(tokensPrice =>{
      this.setState({
        ...this.state,
        ethPrice: tokensPrice.ethereum.usd,
        godsPrice: tokensPrice['gods-unchained'].usd
      })
    })
  }

  fetchOrder = (cardId: number, variation: number, token: Tokens) =>
   this.props.immutableRepo.fetchOrders(cardId, variation, token).then(orders => {
      if (orders.length === 0) return;    
      
        const newPriceList = {...this.state.priceList} as  {[cardId: string]: {minGodsPrice: number, minEthPrice: number}};
        newPriceList[`${cardId}-${variation}`] = {
          minEthPrice: token === Tokens.ETH ? orders[0].ammount : this.state.priceList[`${cardId}-${variation}`]?.minEthPrice || 0,
          minGodsPrice: token === Tokens.GODS ? orders[0].ammount : this.state.priceList[`${cardId}-${variation}`]?.minGodsPrice || 0
        }
        console.log(token === Tokens.ETH ? orders[0].ammount : this.state.priceList[`${cardId}-${variation}`]?.minEthPrice || 0, token === Tokens.GODS ? orders[0].ammount : this.state.priceList[`${cardId}-${variation}`]?.minGodsPrice || 0)

        this.setState({
          ...this.state,
          priceList: {
            ...newPriceList
          }
        })
      })

  fetchOrders = (cardId: number, variation: number = 4) => {
      this.fetchOrder(cardId, variation, Tokens.ETH);
      this.fetchOrder(cardId, variation, Tokens.GODS);
  }

  trackCard = (cardId: number, variation: number, cardName: string) => {
    this.setState({
      ...this.state,
      trackedCards: [
        ...this.state.trackedCards,
        {cardId, variation, cardName}
      ]
    });

    window.sessionStorage.setItem('savedTrackedCards', JSON.stringify([...this.state.trackedCards, {cardId, cardName}]));
    this.fetchOrders(cardId);
  }

  untrackCard = (cardId: number) => {
    const newArray = this.state.trackedCards.filter(card => card.cardId !== cardId);
    this.setState({
      ...this.state,
      trackedCards: newArray
    })
    window.sessionStorage.setItem('savedTrackedCards', JSON.stringify(newArray));
  }

  render () {
    return (
      <div className="App">
        <CardsFilter 
          selectCard={(cardId: number, variation: number, cardName: string) => this.trackCard(cardId, variation, cardName)}
          selectedCards={this.state.trackedCards}
          unselectCard={cardId => this.untrackCard(cardId)}
        />
        <div>
          {Object.keys(this.state.priceList).length === 0 && <div>No cards selected, please select a card</div>}
          {Object.keys(this.state.priceList).length > 0 &&
            <table>
              <tr className='table-header'>
                <th>Id</th>
                <th>Name</th>
                <th>Price ETH</th>
                <th>Price GODS</th>
                <th>Difference</th>
              </tr>
              {Object.keys(this.state.priceList).map(cardKey => {
                const keySplit = cardKey.split('-');
                const card = this.props.immutableRepo.fetchCard(parseInt(keySplit[0]), parseInt(keySplit[1]));
                const cardPrice = this.state.priceList[cardKey];
                return (
                  <tr className='table-row' onClick={() => {
                    console.log(this.props.navigate);
                    this.props.navigate && this.props.navigate(`${card.id}/${card.variation}`)
                    }}>
                    <td>{card.id}-{card.variation}</td>
                    <td>{card.name}</td>
                    <td>{(cardPrice.minEthPrice * this.state.ethPrice).toFixed(2)}$ ({cardPrice.minEthPrice})</td>
                    <td>{(cardPrice.minGodsPrice * this.state.godsPrice).toFixed(2)}$ ({cardPrice.minGodsPrice})</td>
                    <td>{((((cardPrice.minGodsPrice * this.state.godsPrice)-(cardPrice.minEthPrice * this.state.ethPrice))/(cardPrice.minEthPrice * this.state.ethPrice)) * 100).toFixed(2)}%</td>
                  </tr>
                )
              })}
            </table>
          }
        </div>
      </div>
    );
  }
}

function PriceComparer(props:IProps) {
  let navigate = useNavigate();
  return <PriceComparerWrapped {...props} navigate={navigate} />
}

export default PriceComparer;

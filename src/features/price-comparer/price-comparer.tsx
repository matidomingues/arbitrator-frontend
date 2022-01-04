import React, { Component } from 'react';
import './price-comparer.css';
import { ImmutableRepo } from '../../repositories/immutable-repo';
import { Tokens } from '../../api/interfaces';
import { CardsFilter } from '../../components/cards-filter/cards-filter';
import { PriceRepo } from '../../repositories/price-repo';
import { Card } from '../../repositories/interfaces';
import { NavigateFunction, useNavigate } from 'react-router-dom';

interface IState {
  ethPrice: number, 
  godsPrice: number, 
  priceList: {[cardId: string]: {minGodsPrice: number, minEthPrice: number, difference: number}}, 
  cardList: {[cardId:string]: Card},
  trackedCards: {cardId: number, variation: number, cardName: string}[],
  sort: {criteria: string, asc: boolean}
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
    this.state = ({ethPrice: 0, godsPrice: 0, priceList: {}, cardList: {}, trackedCards: savedTrackedCards, sort: {criteria: 'difference', asc: false}});    
  }

  componentDidMount() {
    this.props.priceRepo.getTokensPrice([Tokens.ETH, Tokens.GODS]).then(tokensPrice =>{
      this.setState({
        ...this.state,
        ethPrice: tokensPrice.ethereum.usd,
        godsPrice: tokensPrice['gods-unchained'].usd
      });
      this.state.trackedCards.forEach(card => this.fetchOrders(card.cardId));
    })
  }

  fetchOrder = (cardId: number, variation: number, token: Tokens) =>
   this.props.immutableRepo.fetchOrders(cardId, variation, token).then(orders => {
      if (orders.length === 0) return;    
      
        const newPriceList = {...this.state.priceList} as  {[cardId: string]: {minGodsPrice: number, minEthPrice: number, difference: number}};
        const minEthPrice = token ===Tokens.ETH ? orders[0].ammount : this.state.priceList[`${cardId}-${variation}`]?.minEthPrice || 0;
        const minGodsPrice = token === Tokens.GODS ? orders[0].ammount : this.state.priceList[`${cardId}-${variation}`]?.minGodsPrice || 0;

        newPriceList[`${cardId}-${variation}`] = {
          minEthPrice,
          minGodsPrice,
          difference: ((((minGodsPrice * this.state.godsPrice)-(minEthPrice * this.state.ethPrice))/(minEthPrice * this.state.ethPrice)) * 100)
        }

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

  setSortDirection = ((key: string) => {
    this.setState({
      ...this.state,
      sort: {
        asc: this.state.sort.criteria === key ? !this.state.sort.asc : true,
        criteria: key
      }
    })
  })

  getSortDirection = (key: string) => {
    if (this.state.sort.criteria !== key) return null;
    return this.state.sort.asc ? '▲' : '▼'; 
  }

  render () {
    const sortedKeys = Object.keys(this.state.priceList).sort((first: string, second: string) => {
      switch(this.state.sort.criteria) {
        case 'difference': return this.state.sort.asc ? this.state.priceList[first].difference- this.state.priceList[second].difference :  this.state.priceList[second].difference- this.state.priceList[first].difference;
        case 'minEthPrice': return this.state.sort.asc ? this.state.priceList[first].minEthPrice- this.state.priceList[second].minEthPrice :  this.state.priceList[second].minEthPrice- this.state.priceList[first].minEthPrice;
        case 'minGodsPrice': return this.state.sort.asc ? this.state.priceList[first].minGodsPrice- this.state.priceList[second].minGodsPrice :  this.state.priceList[second].minGodsPrice- this.state.priceList[first].minGodsPrice;
      }
      return -1;
    })

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
                <th className='sortable-header' onClick={() => this.setSortDirection('minEthPrice')}>Price ETH {this.getSortDirection('minEthPrice')}</th>
                <th className='sortable-header' onClick={() => this.setSortDirection('minGodsPrice')}>Price GODS {this.getSortDirection('minGodsPrice')}</th>
                <th className='sortable-header' onClick={() => this.setSortDirection('difference')}>Difference {this.getSortDirection('difference')}</th>
              </tr>
              {sortedKeys.map(cardKey => {
                const keySplit = cardKey.split('-');
                const card = this.props.immutableRepo.fetchCard(parseInt(keySplit[0]), parseInt(keySplit[1]));
                const cardPrice = this.state.priceList[cardKey];
                return (
                  <tr className='table-row' onClick={() => {
                    this.props.navigate && this.props.navigate(`${card.id}/${card.variation}`)
                    }}>
                    <td>{card.id}-{card.variation}</td>
                    <td>{card.name}</td>
                    <td>{(cardPrice.minEthPrice * this.state.ethPrice).toFixed(2)}$ ({cardPrice.minEthPrice})</td>
                    <td>{(cardPrice.minGodsPrice * this.state.godsPrice).toFixed(2)}$ ({cardPrice.minGodsPrice})</td>
                    <td>{cardPrice.difference.toFixed(2)}%</td>
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

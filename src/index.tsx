import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TokenBuyer } from './features/token-buyer/token-buyer';
import { ImmutableApi } from './api/immutable-api';
import { PriceApi } from './api/price-api';
import { ImmutableRepo } from './repositories/immutable-repo';
import { PriceRepo } from './repositories/price-repo';
import { TaskQueue } from './components/task-queue/task-queue';
import { App } from './features/app/app';
import PriceComparer from './features/price-comparer/price-comparer';
import { GodsApi } from './api/gods-api';
import { GodsRepo } from './repositories/gods-repo';
import { BuyApp } from './features/buy-app/buy-app';
import { LoginApp } from './features/login-app/login-app';
import { ListApp } from './features/list-app/list-app';

const immutableApi = new ImmutableApi();
const priceApi = new PriceApi()
const immutableTaskQueue = new TaskQueue(4, 100);
const godsApi = new GodsApi();

const immutableRepo = new ImmutableRepo(immutableApi, immutableTaskQueue);
const priceRepo = new PriceRepo(priceApi);
const godsRepo = new GodsRepo(godsApi);

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App priceRepo={priceRepo} immutableRepo={immutableRepo} godsRepo={godsRepo}/>}>
        <Route path="login" element={<LoginApp />} />
        <Route path="list" element={<ListApp />} />
        <Route path="buy/:orderId" element={<BuyApp />} />
          <Route path=":cardId" element={<TokenBuyer immutableRepo={immutableRepo} />} >
            <Route path=":variationId" element={<TokenBuyer immutableRepo={immutableRepo} />} />
          </Route>
          <Route index element={<PriceComparer immutableRepo={immutableRepo} priceRepo={priceRepo}/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
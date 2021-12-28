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
import { Link } from '@imtbl/imx-sdk';
import PriceComparer from './features/price-comparer/price-comparer';

const immutableApi = new ImmutableApi();
const priceApi = new PriceApi()
const immutableTaskQueue = new TaskQueue(1, 200);

const immutableRepo = new ImmutableRepo(immutableApi, immutableTaskQueue);
const priceRepo = new PriceRepo(priceApi);
const link = new Link();



ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App priceRepo={priceRepo}/>}>
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
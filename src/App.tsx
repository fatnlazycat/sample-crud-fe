import React, { useReducer, useState } from 'react';
import 'dotenv/config'
import { Layout, Spin } from 'antd';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { MainContext, MainCtx, reducer } from './mainContext';
import { List } from './components/List';

function App(): JSX.Element {
  const [mainCtxState, dispatch] = useReducer(reducer, {} as MainCtx);

  const initialContext = {
    mainCtxState,
    dispatch,
  };

  return (
    <MainContext.Provider value={initialContext}>
      <BrowserRouter>
        <Spin 
          spinning={mainCtxState.isLoading}
          size='large'
        >
          <Layout>
            <Routes>
              <Route path='/'>
                <List />
              </Route>
            </Routes>
          </Layout>
        </Spin>
      </BrowserRouter>
    </MainContext.Provider>
  );
}

export default App;

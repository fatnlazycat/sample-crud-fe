import React, { useReducer } from 'react';
import 'antd/dist/antd.min.css';
import { Layout, Spin } from 'antd';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { MainContext, MainCtx, reducer } from './mainContext';
import { List } from './components/List';
import styled from 'styled-components';

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
          <StyledLayout>
            <Routes>
              <Route path='/' element={<List />} />
            </Routes>
          </StyledLayout>
        </Spin>
      </BrowserRouter>
    </MainContext.Provider>
  );
}

export default App;

const StyledLayout = styled(Layout)`
  width: 100%;
  height: 90vh;
  background-color: aliceblue;
`;

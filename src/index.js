import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Registration from './components/Registration/Registration';
import Authorization from './components/Authorization/Authorization';
import Skins from './components/shop/Shop';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Cabinet from './components/cabinet/Cabinet';
import Logout from './components/Logout/Logout';
import ChangePassword from './components/ChangePassword/ChangePassword';
import ResetPassword from './components/ResetPassword/ResetPassword';
import ItemDetailPage from './components/ShopRetrieve/ShopRetrieve';
import Basket from './components/Basket/Basket';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/registration" element={<Registration />} />
        <Route path='/auth' element={<Authorization />} />
        <Route path='/cabinet' element={<Cabinet />} />
        <Route path='/logout' element={<Logout />} />
        <Route path='/change-password' element={<ChangePassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/' element={<Skins />} />
        <Route path='/basket' element={<Basket />} />
        <Route path='/:itemId' element={<ItemDetailPage />} />
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);


reportWebVitals();

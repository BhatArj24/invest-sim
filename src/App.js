import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './Components/Home/Home.js';
import Dashboard from './Components/Dashboard/Dashboard.js';
import Login from './Components/Login/Login.js';
import Register from './Components/Register/Register.js';
import StockPage from './Components/StockPage/StockPage.js';
import Profile from './Components/Profile.js/Profile.js';
import Buy from './Components/Operations/Buy.js';
import Sell from './Components/Operations/Sell.js';
import BuyingPower from './Components/Dashboard/BuyingPower.js';

function App() {
  return (
      <Router>
        <div className='App'>
          <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/home' element={<Home/>} />
            <Route path='/dashboard' element={<Dashboard/>} />
            <Route path='/login' element={<Login/>} />
            <Route path='/register' element={<Register/>} />
            <Route path='/stock/:ticker' element={<StockPage/>} />
            <Route path='/profile' element={<Profile/>} />
            <Route path='/buy/:ticker' element={<Buy/>} />
            <Route path='/sell/:ticker' element={<Sell/>} />
            <Route path='/buying-power' element={<BuyingPower/>} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;


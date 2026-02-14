import React from 'react';
import './App.css';
import LoginForm from './LoginForm';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Signup from './Signup';
import Home from './Home';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import Sidebar from './Components/Sidebar';
import Dashboard from './Components/Dashboard';
import Comment from './Components/Comment';
import Products from './Components/Products';
import ProductsList from './Components/ProductsList';
import About from './Components/About';
import Analytics from './Components/Analytics';
import SideHtml from './SideHtml';


function App() {
  return (
    <div className="App">  
      <BrowserRouter>
      <Routes>
      <Route path='/' element={<LoginForm />}></Route>
      <Route path='/signup' element={<Signup />}></Route>
      <Route path='/home' element={<Home/>}></Route>
      <Route path="/forgotPassword" element={<ForgotPassword />} />
      <Route path="/resetPassword" element={<ResetPassword />} />
      <Route path="/sidebar" element={<Sidebar />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/comment" element={<Comment />} />
      <Route path="/products" element={<Products />} />
      <Route path="/productsList" element={<ProductsList />} />
      <Route path="/about" element={<About />} />
      <Route path="/analytics" element={<Analytics />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}


export default App;

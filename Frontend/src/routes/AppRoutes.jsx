import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import UserRegister from '../pages/auth/userRegister.jsx'
import UserLogin from '../pages/auth/userLogin.jsx'
import FoodPartnerRegister from '../pages/auth/foodPartnerRegister.jsx'
import FoodPartnerLogin from '../pages/auth/foodPartnerLogin.jsx'
import Home from "../pages/general/Home.jsx"
import CreateFood from '../pages/food-partner/CreateFood.jsx'
import Profile from '../pages/food-partner/Profile.jsx' 

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/user/register" element={<UserRegister />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/food-partner/register" element={<FoodPartnerRegister />} />
        <Route path="/food-partner/login" element={<FoodPartnerLogin />} />
        <Route path="/" element={<Home />} />
        <Route path='/create-food' element={<CreateFood />}/>
        <Route path='/food-partner/:id' element={<Profile />} />
      </Routes>
    </Router>
  )
}

export default AppRoutes
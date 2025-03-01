import { useState } from 'react'


import { BrowserRouter, Route , Routes} from 'react-router-dom'
import Home from './components/home'

import Contact from './components/Contact'
import Loan from './components/Loan'
import ReturnBook from './components/ReturnBook'
import BooksPage from './components/BooksPage'
import UserPage  from './components/UserPage'


function App() {

  return <BrowserRouter>
  <Routes>
    <Route index path='/' element={<Home/>}/>
    <Route path='/contacto' element={<Contact/>} />
    <Route path='/prestamos' element={<Loan/>} />
    <Route path='/devolver' element={<ReturnBook/>} />
    <Route path='/usuarios' element={<UserPage/>} />
    <Route path='/libros' element={<BooksPage/>} />
    <Route path='/usuarios' element={<UserPage/>} />

  </Routes>
  </BrowserRouter>
}

export default App

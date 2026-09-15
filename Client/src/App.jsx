import { useState } from 'react'
import './App.css'
import Home from './Pages/Home'
import { StateProvider } from './Provider/StateProvider'
function App() {
  return (
    <>
      <StateProvider>
        <Home />
      </StateProvider>
    </>
  )
}

export default App

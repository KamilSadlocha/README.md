import './App.css';
import Navbar from './components/Navbar/Navbar.js';
import Home from './components/Home/Home.js';
import About from './components/About/About.js';
import Contact from './components/Contact/Contact.js';
import Login from './components/Login/Login.js';

import { Route, Routes } from 'react-router-dom';




function App() {
  return (
    <div className="App">
      <>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </>
    </div>
  );
}

export default App;

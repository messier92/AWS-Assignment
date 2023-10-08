import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from "./pages/LandingPage/LandingPage"
import HomePage from "./pages/HomePage/HomePage"
import AuthenticatedPage from "./pages/AuthenticatedPage/AuthenticatedPage"

function App() {
  return (
    <div className="app">
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/authenticated" element={<AuthenticatedPage/>} />
        <Route path="/home/:id" element={<HomePage/>} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

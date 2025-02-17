import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage.tsx";
import ResultPage from "./components/ResultPage.tsx";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/results" element={<ResultPage />} />
    </Routes>
  </Router>
);

export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import AnalysisDetails from "./pages/AnalysisDetails";

import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import History from "./pages/History";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/history" element={<History />} />
        <Route path="/analysis/:id" element={<AnalysisDetails />} />
      </Routes>
    </BrowserRouter>
  );
}
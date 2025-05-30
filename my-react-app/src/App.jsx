import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import HomePage from './pages/HomePage';
import './App.css'; 

function App() {
  return (
    <Router>
      <Layout> {/* Layout wraps the routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* Other routes can be added here later */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

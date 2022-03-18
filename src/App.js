import './App.css';
import AccueilATC from './Containers/ATC/AccueilATC';
import AccueilD from './Containers/Décideur/AccueilD';
import NotFound from './Containers/404';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
      <Routes>
        <Route caseSensitive={false} path='/decideur/*' element={<AccueilD/>} />
        <Route caseSensitive={false} path='/atc/*' element={<AccueilATC/>} />
        <Route caseSensitive={false} path='/404' element={<NotFound/>} />
        <Route path="*" element={<Navigate replace to="/404" />}/>
      </Routes>
      </div>
    </Router>
  );
}

export default App;

import './App.css';
import PageATC from './Containers/ATC/PageATC';
import PageD from './Containers/Décideur/PageD';
import NotFound from './Containers/404';
import { UserProvider } from "./Context.js";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom';
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
library.add(fas, fab);
function App() {
  //Routing de la plateforme AutoTek
  
  return (
    <UserProvider>
      <Router>
        <div className="App">
        <Routes>
          <Route caseSensitive={false} path='/decideur/*' element={<PageD/>}/>
          <Route caseSensitive={false} path='/atc/*' element={<PageATC/>} />
          <Route caseSensitive={false} path='/404' element={<NotFound/>} />
          <Route path="/" element={<Navigate replace to="/decideur" />}/>
          <Route path="*" element={<Navigate replace to="/404" />}/>
        </Routes>
        </div>
      </Router>
      </UserProvider>
  );
}

export default App;

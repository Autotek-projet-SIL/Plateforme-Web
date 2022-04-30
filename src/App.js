import './App.css';
import "./Composants/stylesheets/bootsrapNeededStles.css";
import PageATC from './Containers/ATC/PageATC';
import PageD from './Containers/Décideur/PageD';
import NotFound from './Containers/404';
import { UserProvider } from "./Context.js";
import { transitions, positions, Provider as AlertProvider } from 'react-alert';
import AlertTemplate from './Composants/Alert.js';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
library.add(fas, fab);

const options = {
  position: positions.TOP_CENTER,
  timeout: 6000,
  offset: '10px',
  transition: transitions.FADE
}

function App() {
  //Routing de la plateforme AutoTek
  
  return (
    <AlertProvider template={AlertTemplate} {...options}>
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
  </AlertProvider>
  );
}

export default App;

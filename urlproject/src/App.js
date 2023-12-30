import './App.css';
import Login from './firebaseconfig';
import { Route,Routes } from 'react-router-dom';
import Home from './home';
import UserLists from './userslists';







function App() {
  return (
    <div>
   <Routes>
    <Route path='/' element={<Login />}/>
    <Route path='/home' element={<Home/>}/>
    <Route path='/users' element={<UserLists/>}/>

   </Routes>
    
    
    </div>
  );
}

export default App;

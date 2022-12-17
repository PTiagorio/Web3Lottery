import './App.css';
import LotteryScreen from './MainScreen'
import AdminScreen from './AdminScreen'
import { Routes, Route, Outlet } from 'react-router-dom';
import ReactDOM from "react-dom";

function App() {
  return (
    <div>
      <Routes>
        <Route exact path="/" component={<LotteryScreen/>} />
        <Route path="/adminScreen" component={<AdminScreen/>} />
      </Routes>
      <Outlet></Outlet>
    </div>
  );
}

export default App;

if(document.getElementById('app')){
  ReactDOM.render(<App/>,document.getElementById('app'));
}
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import AppLayout from "./layout/AppLayout";

function App() {


  return (
    <div>
      <BrowserRouter>
      
      <AppLayout />
      
      </BrowserRouter>
    </div>
  );
}

export default App;

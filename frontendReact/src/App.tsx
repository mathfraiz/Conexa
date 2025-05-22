// App.tsx
import { BrowserRouter } from "react-router-dom";
import RotasApp from "./rotas/RotasApp";

function App() {
  return (
    <div className="w-screen h-screen">
      <BrowserRouter>
        <RotasApp />
      </BrowserRouter>
    </div>
  );
}

export default App;

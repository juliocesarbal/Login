import "./styles.css";
import Router from "./Router/routes.jsx";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <Router />
      <ToastContainer/>
    </>
  );
}

export default App;

import "./App.css";
import UserLogin from "../components/UserLogin/UserLogin.jsx";
import CodeInterface from "../components/CodeInterface/CodeInterface.jsx";
import Header from "../components/Header/Header.jsx";
import Footer from "../components/Footer/Footer.jsx";
import ClawMachine from "../components/UI/ClawMachine.jsx";

function App() {
  return (
    <>
      <UserLogin />
      <ClawMachine />
      <Footer />
      <CodeInterface />
    </>
  );
}

export default App;

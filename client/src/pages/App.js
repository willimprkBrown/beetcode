import './App.css';
import UserLogin from '../components/UserLogin/UserLogin.jsx'
import CodeInterface from '../components/CodeInterface/CodeInterface.jsx'
import Header from '../components/Header/Header.jsx'
import Footer from '../components/Footer/Footer.jsx'

function App() {
  return (
    <>
      <UserLogin/>
      <Header/>
      <Footer/>
      <CodeInterface/>
    </>
  );
}

export default App;

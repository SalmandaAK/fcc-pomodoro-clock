import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Header from './Header';
import PomodoroClock from './PomodoroClock';
import Footer from './Footer';
import './App.css';

function App() {
  return (
    <div id="background" className="text-bg-dark">
      <Container className="text-center vh-100 d-flex flex-column justify-content-center align-items-center">
        <Row>
          <Header />
        </Row>
        <Row>
          <PomodoroClock />
        </Row>
        <Row>
          <Footer />
        </Row>
      </Container>
    </div>
  );
}















export default App;

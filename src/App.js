import './App.css';
import RestApiEditor from "./RestApiEditor";
import React from "react";
import {Container} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <Container>
          <RestApiEditor />
      </Container>
    </div>
  );
}

export default App;

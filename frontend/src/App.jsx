import { transitions, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import SomePage from "./pages/SomePage";
import NavbarComponent from "./components/NavbarComponent";
import Login from "./pages/Login";
import { PrivateRoute } from "./hooks/PrivateRoute";
const options = {
  position: positions.BOTTOM_RIGHT,
  timeout: 5000,
  offset: "30px",
  // you can also just use 'scale'
  transition: transitions.SCALE,
};

function App() {
  return (
    <AlertProvider template={AlertTemplate} {...options}>
      <Router>
        <NavbarComponent />
        <Routes>
          <Route exact path="/" element={<PrivateRoute />}>
            <Route exact path="/" element={<Home />} />
          </Route>
          {/* <Route path="/somepage" element={<SomePage />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/notfound" element={<NotFound />} />
        </Routes>
      </Router>
    </AlertProvider>
  );
}

export default App;

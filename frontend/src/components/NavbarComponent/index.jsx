import React from "react";
import { Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { IoLogOutOutline } from "react-icons/io5";
import { useRecoilState } from "recoil";
import { authState } from "../../state/authData";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/NammaAuthenticator.png";

const NavbarComponent = () => {
  const navigate = useNavigate();
  const accessToken = window.localStorage.getItem("accessToken");
  const [auth, setAuth] = useRecoilState(authState);
  const logout = () => {
    window.localStorage.setItem("accessToken", "");
    window.localStorage.setItem("refreshToken", "");
    window.localStorage.setItem("user", "");
    navigate(`/login`);
    setAuth({
      accessToken: null,
      authStatus: false,
      errorMessage: "",
      userName: "",
    });
  };
  return (
    <div>
      <Navbar bg="dark" data-bs-theme="dark">
        <Navbar.Brand href="/" style={{ marginLeft: "10px", display: "flex" }}>
          <img
            src={logo}
            alt="Logo"
            width="25px"
            height="25px"
            style={{
              marginRight: "10px",
              borderRadius: "8px",
              objectFit: "contain",
            }}
          />
          Namma Authenticator
        </Navbar.Brand>
        <Nav className="me-auto">
          {/* <Nav.Link href="#home">Home</Nav.Link>
          <Nav.Link href="#features">Features</Nav.Link>
          <Nav.Link href="#pricing">Pricing</Nav.Link> */}
        </Nav>
        {accessToken ? (
          <Button
            variant="outline-danger"
            style={{ marginRight: "10px" }}
            onClick={() => {
              logout();
            }}
          >
            <IoLogOutOutline />
          </Button>
        ) : (
          <></>
        )}
      </Navbar>
    </div>
  );
};

export default NavbarComponent;

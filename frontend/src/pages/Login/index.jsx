import React, { useEffect } from "react";
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBIcon,
} from "mdb-react-ui-kit";
import { useRecoilState } from "recoil";
import { authState } from "../../state/authData";
import { useForm } from "react-hook-form";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import { axiosClient } from "../../hooks/api";
import loginImage from "../../assets/images/auth_login.svg";

function Login() {
  const alert = useAlert();
  const [auth, setAuth] = useRecoilState(authState);
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const userLogin = (userName, password) => {
    axiosClient
      .post("/auth/jwt/login", {
        username: userName,
        password: password,
      })
      .then((response) => {
        setAuth({
          accessToken: response.data.access,
          authStatus: true,
          errorMessage: "",
          userName: userName,
        });
        window.localStorage.setItem("accessToken", response.data.access);
        window.localStorage.setItem("refreshToken", response.data.refresh);
        window.localStorage.setItem("user", userName);

        // axiosClient
        //   .get("/engineers/?auth_user__username=" + userName, {
        //     headers: {
        //       authorization:
        //         "Bearer " + window.localStorage.getItem("accessToken"),
        //     },
        //   })
        //   .then((res) => {
        //     window.localStorage.setItem("userid", res.data.results[0].id);
        //     window.localStorage.setItem(
        //       "employee_id",
        //       res.data.results[0].employee_id
        //     );
        //     window.localStorage.setItem("name", res.data.results[0].name);
        //     window.localStorage.setItem("role", res.data.results[0].role);
        //   });
      })
      .catch((error) => {
        alert.error(error.response.data.detail);
        setAuth({
          accessToken: "",
          authStatus: false,
          errorMessage: error.response.data.detail,
          userName: "",
        });
      });
  };

  const handleRegistration = (data) => {
    userLogin(data["userName"], data["password"]);
  };
  useEffect(() => {
    if (auth.authStatus) {
      navigate(`/`);
      // history.go(0);
    }
  }, [auth]);

  return (
    <MDBContainer className="my-5">
      <MDBCard>
        <MDBRow className="g-0">
          <MDBCol md="6">
            <MDBCardImage
              src={loginImage}
              alt="login form"
              className="rounded-start w-100"
            />
          </MDBCol>

          <MDBCol md="6" style={{ background: "#404040" }}>
            <MDBCardBody className="d-flex flex-column">
              <div className="d-flex mt-2 flex-row">
                <MDBIcon
                  fas
                  icon="cubes fa-3x me-3"
                  style={{ color: "#ff6219" }}
                />
                <span
                  className="h1 fw-bold mb-0"
                  style={{
                    color: "white",
                    textAlign: "center",
                    marginLeft: "25%",
                  }}
                >
                  Namma Authenticator
                </span>
              </div>

              <h5
                className="fw-normal my-2 pb-3"
                style={{
                  letterSpacing: "1px",
                  color: "white",
                  textAlign: "center",
                }}
              >
                Sign into your account
              </h5>

              <form onSubmit={handleSubmit(handleRegistration)}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label style={{ color: "white", textAlign: "center" }}>
                    Username
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Username"
                    name="userName"
                    {...register("userName")}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label style={{ color: "white", textAlign: "center" }}>
                    Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    name="password"
                    {...register("password")}
                  />
                </Form.Group>
                <div
                  style={{ justifyContent: "space-between", display: "flex" }}
                >
                  <Button
                    variant="primary"
                    style={{ background: "#404040", color: "white" }}
                    onClick={handleSubmit(handleRegistration)}
                    type="submit"
                  >
                    Submit
                  </Button>
                </div>
              </form>

              {/* <a className="small text-muted" href="#!">
                Forgot password?
              </a> */}
              {/* <p className="mb-3 pb-lg-2" style={{ color: "#393f81" }}>
                Don't have an account?{" "}
                <a href="" style={{ color: "#393f81" }}>
                  Register here
                </a>
              </p> */}

              {/* <div className="d-flex flex-row justify-content-start">
                <a href="#!" className="small text-muted me-1">
                  Terms of use.
                </a>
                <a href="#!" className="small text-muted">
                  Privacy policy
                </a>
              </div> */}
            </MDBCardBody>
          </MDBCol>
        </MDBRow>
      </MDBCard>
    </MDBContainer>
  );
}

export default Login;

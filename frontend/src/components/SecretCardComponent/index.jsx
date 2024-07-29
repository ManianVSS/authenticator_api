import React, { useEffect, useState } from "react";
import { Button, Card, Col, Modal, Row, Table } from "react-bootstrap";
import "./style.css";
import { FaArrowAltCircleRight } from "react-icons/fa";
import CountDownTimerComponent from "../CountDownTimerComponent";
import { axiosClient } from "../../hooks/api";

const SecretCardComponent = (props) => {
  const [show, setShow] = useState(false);
  const [otp, setOtp] = useState(null);
  const [otpValidity, setOtpValidity] = useState(0);
  const [timerComponent, setTimerComponent] = useState(<></>);
  const handleClose = () => {
    setShow(false);
  };

  const handleShow = () => {
    setShow(true);
    getOTP();
  };
  const getOTP = () => {
    axiosClient({
      method: "get",
      url:
        "/authenticator/api/generate_totp?authenticator_secret=" +
        props.data.id,
      headers: {
        authorization: "Bearer " + window.localStorage.getItem("accessToken"),
      },
    })
      .then(function (response) {
        setOtp(response.data.otp);
        setOtpValidity(response.data.validity_in_seconds);

        setTimerComponent(
          <CountDownTimerComponent
            id={props.data.id}
            otp={response.data.otp}
            validity={response.data.validity_in_seconds}
          />
        );
      })
      .catch(function (response) {
        alert.error("Failed to fetch OTP");
      });
  };

  useEffect(() => {
    getOTP();
  }, []);
  return (
    <>
      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Secret Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover>
            <tbody>
              <tr>
                <th>User</th>
                <td>{props.data.user}</td>
              </tr>
              <tr>
                <th>Secret</th>
                <td>{props.data.secret}</td>
              </tr>
              <tr>
                <th>Issuer</th>
                <td>{props.data.issuer}</td>
              </tr>
              <tr>
                <th>URL</th>
                <td>{props.data.url}</td>
              </tr>
              <tr>
                <th>QR-Code image file in PNG format</th>
                <td>
                  <a target="_blank" href={props.data.qr_code}>
                    {props.data.qr_code}
                  </a>
                </td>
              </tr>
              <tr>
                <th>Is already initialized</th>
                <td>
                  {props.data.initialized ? "Initialized" : "Not Initialized"}
                </td>
              </tr>
            </tbody>
          </Table>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* <CountDownTimerComponent
              id={props.data.id}
              otp={otp}
              validity={otpValidity}
              getOtp={getOTP}
            /> */}
            {timerComponent}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="secret-card" onClick={handleShow}>
        <Card border="success" style={{ width: "25rem" }}>
          {/* <Card.Header>Header</Card.Header> */}
          <Card.Body>
            <Card.Title>
              <Row className="justify-content-md-center">
                <Col xs lg="4" style={{ margin: "auto" }}>
                  <div>{props.data.issuer}</div>
                </Col>
                <Col md="auto" style={{ margin: "auto" }}>
                  <FaArrowAltCircleRight />
                </Col>
                <Col xs lg="4" style={{ margin: "auto" }}>
                  <div>{props.data.user}</div>
                </Col>
              </Row>
            </Card.Title>
            {/* <Card.Text>
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </Card.Text> */}
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

export default SecretCardComponent;

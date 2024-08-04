import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Modal,
  OverlayTrigger,
  Popover,
  Row,
  Table,
} from "react-bootstrap";
import "./style.css";
import { FaArrowAltCircleRight } from "react-icons/fa";
import CountDownTimerComponent from "../CountDownTimerComponent";
import { useAlert } from "react-alert";
import { axiosClient } from "../../hooks/api";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { CiMenuKebab } from "react-icons/ci";

const SecretCardComponent = (props) => {
  const [show, setShow] = useState(false);
  const alert = useAlert();
  const handleClose = () => {
    setShow(false);
  };

  const handleShow = () => {
    setShow(true);
  };

  const deleteSecret = () => {
    axiosClient({
      method: "delete",
      url: "/authenticator/api/secrets/" + props.data.id + "/",
      headers: {
        authorization: "Bearer " + window.localStorage.getItem("accessToken"),
      },
    })
      .then(function (response) {
        //handle success
        alert.success("Secret deleted successfully");
        props.getSecrets();
      })
      .catch(function (response) {
        //handle error
        alert.error("Failed to delete the secret");
        // console.error(response);
      });
  };

  const confirmDeleteSecret = () => {
    handleClose();
    confirmAlert({
      title: "Delete Secret",
      message:
        "Are you sure to delete the secret with details ISSUER " +
        props.data.issuer +
        " & USER " +
        props.data.user +
        "?",
      buttons: [
        {
          label: "I Confirm",
          onClick: () => deleteSecret(),
        },
        {
          label: "No",
          // onClick: () => alert("Click No")
        },
      ],
    });
  };

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
            <CountDownTimerComponent id={props.data.id} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={confirmDeleteSecret}>
            Delete Secret
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="secret-card">
        {/* <div className="secret-card" onClick={handleShow}> */}
        <Container>
          <Row>
            <Col style={{ textAlign: "center", margin: "auto" }}>
              <div>
                <div
                  style={{
                    border: "1px solid #404040",
                    borderRadius: "10px",
                    color: "white",
                    backgroundColor: "#404040",
                  }}
                >
                  Issuer
                </div>
                <div
                  style={{
                    fontWeight: "bold",
                    border: "1px solid #404040",
                    borderRadius: "10px",
                    marginTop: "2px",
                  }}
                >
                  {props.data.issuer}
                </div>
              </div>
            </Col>
            <Col style={{ textAlign: "center", margin: "auto" }}>
              <div>
                <div
                  style={{
                    border: "1px solid #404040",
                    borderRadius: "10px",
                    color: "white",
                    backgroundColor: "#404040",
                  }}
                >
                  User
                </div>
                <div
                  style={{
                    fontWeight: "bold",
                    border: "1px solid #404040",
                    borderRadius: "10px",
                    marginTop: "2px",
                  }}
                >
                  {props.data.user}
                </div>
              </div>
            </Col>
            <Col>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingTop: "2px",
                  paddingBottom: "2px",
                }}
              >
                <CountDownTimerComponent id={props.data.id} />
              </div>
            </Col>
            <Col
              md="auto"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <OverlayTrigger
                trigger="click"
                key="top"
                placement="top"
                rootClose={true}
                overlay={
                  <Popover id={`popover-positioned-top`}>
                    {/* <Popover.Header as="h3"></Popover.Header> */}
                    <Popover.Body>
                      <Button
                        variant="outline-danger"
                        onClick={confirmDeleteSecret}
                      >
                        Delete
                      </Button>
                    </Popover.Body>
                  </Popover>
                }
              >
                <div>
                  <CiMenuKebab
                    style={{
                      fontSize: "25px",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  />
                </div>
              </OverlayTrigger>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default SecretCardComponent;

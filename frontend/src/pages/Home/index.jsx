import React, { useEffect, useState } from "react";
import FloatingButtonComponent from "../../components/FloatingButtonComponent";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import SecretCardComponent from "../../components/SecretCardComponent";
import ImageUploadComponent from "../../components/ImageUploadComponent";
import { axiosClient } from "../../hooks/api";
import { useAlert } from "react-alert";

const Home = () => {
  const alert = useAlert();
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    setSelectedImage(null);
  };

  const handleShow = () => setShow(true);

  const [selectedImage, setSelectedImage] = useState(null);
  const [secrets, setSecrets] = useState([]);
  const postQRCode = () => {
    var bodyFormData = new FormData();
    bodyFormData.append("qr_code", selectedImage);
    axiosClient({
      method: "post",
      url: "/authenticator/api/secrets/",
      data: bodyFormData,
      headers: {
        authorization: "Bearer " + window.localStorage.getItem("accessToken"),
        "Content-Type": "multipart/form-data",
      },
    })
      .then(function (response) {
        //handle success
        alert.success("Secret successfully added");
        getSecrets();
      })
      .catch(function (response) {
        //handle error
        alert.error("Failed to add the secret");
      });
    handleClose();
  };
  const getSecrets = () => {
    axiosClient({
      method: "get",
      url: "/authenticator/api/secrets/",
      headers: {
        authorization: "Bearer " + window.localStorage.getItem("accessToken"),
      },
    })
      .then(function (response) {
        //handle success
        setSecrets(response.data.results);
      })
      .catch(function (response) {
        //handle error
        alert.error("Failed to fetch secrets");
        // console.error(response);
      });
  };
  useEffect(() => {
    getSecrets();
  }, []);
  return (
    <div>
      {/* Modal to add secret */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Upload QR Code</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ImageUploadComponent
            image={selectedImage}
            imgSetFunc={setSelectedImage}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={postQRCode}>
            Add Secret
          </Button>
        </Modal.Footer>
      </Modal>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "flex-end",
        }}
      >
        <FloatingButtonComponent onClickEvent={handleShow} />
      </div>
      <Container>
        <Row className="justify-content-md-center">
          {secrets.map((item) => {
            return (
              <Col md="auto" key={item.id}>
                <SecretCardComponent data={item} />
              </Col>
            );
          })}
        </Row>
      </Container>
    </div>
  );
};

export default Home;

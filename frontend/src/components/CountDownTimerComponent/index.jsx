import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { axiosClient } from "../../hooks/api";

const CountDownTimerComponent = (props) => {
  const [key, setKey] = useState(props.validity);
  const [otp, setOtp] = useState(props.otp);
  const [otpValidity, setOtpValidity] = useState(props.validity);

  const renderTime = ({ remainingTime }) => {
    // if (remainingTime === 0) {
    //   return <div className="timer">Too lale...</div>;
    // }

    return <h1 style={{ fontWeight: "bold", fontSize: "24px" }}>{otp}</h1>;
  };
  const getOTP = () => {
    axiosClient({
      method: "get",
      url: "/authenticator/api/generate_totp?authenticator_secret=" + props.id,
      headers: {
        authorization: "Bearer " + window.localStorage.getItem("accessToken"),
      },
    })
      .then(function (response) {
        setOtp(response.data.otp);
        setOtpValidity(response.data.validity_in_seconds);
        console.log(response.data);
      })
      .catch(function (response) {
        alert.error("Failed to fetch OTP");
      });
  };
  return (
    <div>
      <CountdownCircleTimer
        key={otpValidity}
        isPlaying
        duration={otpValidity}
        colors={["#00cc44", "#ffcc00", "#ff8566", "#ff3300"]}
        colorsTime={[10, 7, 4, 0]}
        // children={childComp}
        onComplete={() => setKey((prevKey) => getOTP())}
      >
        {/* {({ remainingTime }) => remainingTime} */}
        {/* {({ remainingTime }) => props.otp} */}
        {renderTime}
      </CountdownCircleTimer>
    </div>
  );
};

export default CountDownTimerComponent;

import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { axiosClient } from "../../hooks/api";

const CountDownTimerComponent = (props) => {
  const [key, setKey] = useState(0);
  const [otp, setOtp] = useState(null);
  const [otpValidity, setOtpValidity] = useState(null);
  const [otpPeriod, setOtpPeriod] = useState(null);

  const renderTime = ({ remainingTime }) => {
    // if (remainingTime === 0) {
    //   return <div className="timer">Too lale...</div>;
    // }

    return <h1 style={{ fontWeight: "bold", fontSize: "18px" }}>{otp}</h1>;
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
        setKey(response.data.validity_in_seconds);
        setOtpPeriod(response.data.period);
      })
      .catch(function (response) {
        alert.error("Failed to fetch OTP");
      });
  };
  useEffect(() => {
    getOTP();
  }, []);

  return (
    <CountdownCircleTimer
      key={key}
      isPlaying
      duration={otpPeriod}
      initialRemainingTime={otpValidity}
      colors={["#00cc44", "#ffcc00", "#ff8566", "#ff3300"]}
      colorsTime={[10, 7, 4, 0]}
      // children={childComp}
      size={80}
      strokeWidth={5}
      onComplete={() => {
        getOTP();
        setKey((prevKey) => prevKey + 1);
      }}
    >
      {/* {({ remainingTime }) => remainingTime} */}
      {renderTime}
    </CountdownCircleTimer>
  );
};

export default CountDownTimerComponent;

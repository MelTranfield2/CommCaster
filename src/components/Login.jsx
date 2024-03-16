import React, { useState } from "react";
import { magic } from "../lib/magic.jsx";
import OTPModal from "./OTPModal.jsx";
import EmailForm from "./EmailForm.jsx";
import DeviceRegistration from "./DeviceRegistration.jsx";


export default function Login({ setUser }) {
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showDeviceRegistrationModal, setShowDeviceRegistrationModal] =
    useState(false);
  const [otpLogin, setOtpLogin] = useState();

  const handleEmailLoginCustom = async (email) => {
    try {
      setOtpLogin();
      const otpLogin = magic.auth.loginWithEmailOTP({
        email,
        showUI: false,
        deviceCheckUI: false,
      });
      setOtpLogin(otpLogin);

      otpLogin
        .on("device-needs-approval", () => {

          setShowDeviceRegistrationModal(true);
        })
        .on("device-approved", () => {

          setShowDeviceRegistrationModal(false);
        })
        .on("email-otp-sent", () => {

          setShowOTPModal(true);
        })
        .on("done", (result) => {
          handleGetMetadata();

          console.log(`DID Token: %c${result}`, "color: orange");
        })
        .catch((err) => {
          console.log("%cError caught during login:\n", "color: orange");
          console.error(err);
        })
        .on("settled", () => {

          setOtpLogin();
          setShowOTPModal(false);
          setShowDeviceRegistrationModal(false);
        });
    } catch (err) {
      console.error(err);
    }
  };

  const handleGetMetadata = async () => {
    const metadata = await magic.user.getMetadata();

    setUser(metadata);

    console.table(metadata);
  };

  const handleCancel = () => {
    try {
      otpLogin.emit("cancel");

      console.log("%cUser canceled login.", "color: orange");
    } catch (err) {
      console.log("Error canceling login:", err);
    }
  };

  return (
    <div className="login">
      {showDeviceRegistrationModal ? (
        <DeviceRegistration
          login={otpLogin}
          handleCancel={handleCancel}
          setShowDeviceRegistrationModal={setShowDeviceRegistrationModal}
        />
      ) : showOTPModal ? (
        <OTPModal login={otpLogin} handleCancel={handleCancel} />
      ) : (
        <EmailForm handleEmailLoginCustom={handleEmailLoginCustom} />
      )}
    </div>
  );
}

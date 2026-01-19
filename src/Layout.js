import { Outlet } from "react-router-dom";
import Nav from "./Components/Nav";
import Footer from "./Components/Footer";

import CustomerLogin from "./Components/AuthComponents/CustomerLogin";
import CustomerSignUp from "./Components/AuthComponents/CustomerSignUp";
import CustomerResetPassword from "./Components/AuthComponents/CustomerResetPassword";
import CustomerVerifyAccount from "./Components/AuthComponents/CustomerVerifyAccount";
import MessageBox from "./Components/MessageBox/MessageBox";
import { useEffect, useState } from "react";
import MessageBox2 from "./Components/MessageBox2/MessageBox2";
import SubscribeButton from "./SubscribeButton";
import axios from "axios";
import SignInPage from "./SignInPage";

const Layout = () => {
  const [isCustomerLoginVisible, setIsCustomerLoginVisible] = useState(false);

  const [isCustomerSignUpVisible, setIsCustomerSignUpVisible] = useState(false);

  const [isCustomerForgetPasswordVisible, setIsCustomerForgetPasswordVisible] =
    useState(false);

  const [isCustomerVerifyAccountVisible, setIsCustomerVerifyAccountVisible] =
    useState(false);

  const [mainEmail, setMainEmail] = useState("");

  const handlePageChange = (key) => {
    switch (key) {
      case "login":
        setIsCustomerLoginVisible(true);
        setIsCustomerSignUpVisible(false);
        setIsCustomerForgetPasswordVisible(false);
        setIsCustomerVerifyAccountVisible(false);
        break;
      case "signup":
        setIsCustomerLoginVisible(false);
        setIsCustomerSignUpVisible(true);
        setIsCustomerForgetPasswordVisible(false);
        setIsCustomerVerifyAccountVisible(false);
        break;
      case "forget":
        setIsCustomerLoginVisible(false);
        setIsCustomerSignUpVisible(false);
        setIsCustomerForgetPasswordVisible(true);
        setIsCustomerVerifyAccountVisible(false);
        break;
      case "verify":
        setIsCustomerLoginVisible(false);
        setIsCustomerSignUpVisible(false);
        setIsCustomerForgetPasswordVisible(false);
        setIsCustomerVerifyAccountVisible(true);
        break;
      default:
        setIsCustomerLoginVisible(false);
        setIsCustomerSignUpVisible(false);
        setIsCustomerForgetPasswordVisible(false);
        setIsCustomerVerifyAccountVisible(false);
    }
  };

  // useEffect(() => {
  //   window.OneSignal = window.OneSignal || [];
  //   window.OneSignalDeferred = window.OneSignalDeferred || [];
  //   window.OneSignalDeferred.push(async function (OneSignal) {
  //     try {
  //       await OneSignal.init({
  //         appId: "718983a2-79ca-42de-8aec-a940452f08f9",
  //         // appId: "cae638b9-f4d8-4969-b0fe-9c08ca597cb2",
  //         autoRegister: false,
  //         promptOptions: {
  //           slidedown: {
  //             enabled: false,
  //           },
  //         },
  //         notifyButton: {
  //           enable: false, // disables the bell widget
  //         },
  //       });
  //     } catch (e) {
  //       console.error("OneSignal init failed", e);
  //       // Optional: show fallback message to user
  //     }
  //   });

  //   // rest of init code
  // }, []);

  // useEffect(() => {
  //   window.OneSignal = window.OneSignal || [];
  //   window.OneSignalDeferred = window.OneSignalDeferred || [];
  //   window.OneSignalDeferred.push(async function (OneSignal) {
  //     try {
  //       await OneSignal.init({
  //         appId: "718983a2-79ca-42de-8aec-a940452f08f9",
  //         // appId: "cae638b9-f4d8-4969-b0fe-9c08ca597cb2",
  //         autoRegister: false,
  //         promptOptions: {
  //           slidedown: {
  //             enabled: false,
  //           },
  //         },
  //         notifyButton: {
  //           enable: false,
  //         },
  //       });

  //       // v16 SDK → OneSignal.User.onesignalId
  //       const oneSignalId = OneSignal?.User?.onesignalId;

  //       // Get token from localStorage
  //       const token = localStorage.getItem("token");

  //       if (oneSignalId && token) {
  //         console.log("Sending OneSignal ID:", oneSignalId);
  //         try {
  //           await axios.post(
  //             `${process.env.REACT_APP_API_URL}/api/customer/save-onesignal-id`,
  //             { oneSignalId },
  //             {
  //               headers: {
  //                 Authorization: `${token}`,
  //               },
  //             }
  //           );
  //           console.log("OneSignal ID saved successfully.");
  //         } catch (error) {
  //           console.error("Failed to save OneSignal ID:", error);
  //           // Optionally, handle specific error types or show a user-friendly message
  //         }
  //       }

  //       try {
  //         const isSubscribed = await OneSignal.User.Push.isSubscribed();

  //         if (isSubscribed) {
  //           await OneSignal.User.addTags({
  //             name: localStorage.getItem("name") || "User Not Logged In",
  //             email: localStorage.getItem("email") || "User Not Logged In",
  //           });
  //           console.log("Tags added/updated on OneSignal user.");
  //         } else {
  //           console.warn(
  //             "User is not subscribed to push notifications. Tags not added."
  //           );
  //         }
  //       } catch (err) {
  //         console.error("Failed to add tags:", err);
  //       }

  //       // 👉 Add user tags here
  //       await OneSignal?.User?.addTags({
  //         name: localStorage.getItem("name") || "User Not Logged In",
  //         email: localStorage.getItem("email") || "User Not Logged In",
  //       });

  //       // console.log("Tags added to OneSignal user.");
  //     } catch (e) {
  //       console.error("OneSignal init failed", e);
  //     }
  //   });
  // }, []);

  // useEffect(() => {
  //   window.OneSignalDeferred = window.OneSignalDeferred || [];
  //   window.OneSignalDeferred.push(async function (OneSignal) {
  //     await OneSignal.init({
  //       appId: "718983a2-79ca-42de-8aec-a940452f08f9",
  //       autoRegister: false,
  //       promptOptions: {
  //         slidedown: {
  //           enabled: false,
  //         },
  //       },
  //       notifyButton: {
  //         enable: false, // disables the bell widget
  //       },
  //     });
  //   });
  // }, []);

  return (
    <div className="w-screen h-screen font-medio">
      {/* <button id="subscribe-btn">Subscribe to Notifications</button>
      <SubscribeButton /> */}

      {/* <SubscribeButton />  */}

      <div className="">
        <Nav handlePageChange={handlePageChange} />
        {/* <LandingPageBackground /> */}
        <Outlet />
        <Footer />
      </div>

      {/* {isCustomerLoginVisible && (
        <CustomerLogin
          setIsCustomerLoginVisible={setIsCustomerLoginVisible}
          handlePageChange={handlePageChange}
          setMainEmail={setMainEmail}
        />
      )} */}
      {isCustomerSignUpVisible && (
        <CustomerSignUp
          setIsCustomerSignUpVisible={setIsCustomerSignUpVisible}
          handlePageChange={handlePageChange}
          setMainEmail={setMainEmail}
        />
      )}
      {isCustomerForgetPasswordVisible && (
        <CustomerResetPassword
          setIsCustomerForgetPasswordVisible={
            setIsCustomerForgetPasswordVisible
          }
          handlePageChange={handlePageChange}
          setMainEmail={setMainEmail}
        />
      )}
      {isCustomerVerifyAccountVisible && (
        <CustomerVerifyAccount
          setIsCustomerVerifyAccountVisible={setIsCustomerVerifyAccountVisible}
          mainEmail={mainEmail}
        />
      )}
      {/* <MessageBox setIsCustomerLoginVisible={setIsCustomerLoginVisible} />  */}
      {/* <MessageBox2 setIsCustomerLoginVisible={setIsCustomerLoginVisible} /> */}
      {/* <SignInPage setIsCustomerLoginVisible={setIsCustomerLoginVisible} /> */}
    </div>
  );
};

export default Layout;

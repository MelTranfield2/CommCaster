import { useEffect, useState } from "react";
import { magic } from "./lib/magic.jsx";
import Header from "./components/Header.jsx";
import Loading from "./components/Loading.jsx";
import LoginForm from "./components/Login.jsx";
import Logout from "./components/Logout.jsx";
import UserInfo from "./components/UserInfo.jsx";
import Footer from "./components/Footer.jsx";
import MyButton from "./components/MyButton.jsx";
import { makeTransaction } from "./SmartAccountSafe.jsx";

function App() {
  const [user, setUser] = useState();
  const [startTransaction, setStartTransaction] = useState(false);
  useEffect(() => {
    setUser({ loading: true });

    magic.user
      .isLoggedIn()
      .then((isLoggedIn) => {
        if (isLoggedIn) {
          magic.user.getMetadata().then((userData) => {
            setUser(userData);
          });
        } else {
          setUser({ user: null });
        }
      })
      .catch((err) => {
        console.log("Error, isLoggedIn():");
        console.error(err);
        magic.user.logout().then(console.log);
        setUser({ user: null });
      });
  }, []);

  console.log("app works");

  useEffect(() => {
    console.log("status of " + startTransaction);
    const transaction = async () => {
      alert("Transaction was made!");
      await makeTransaction();
      console.log("makeTransaction completed");
    };
    if (startTransaction) {
      try {
        transaction();
      } catch (e) {
        console.log("TRANSACTION ERROR: ", e.message);
      }
      setStartTransaction(false);
    }
  }, [startTransaction]);
  const handleButtonClick = () => {
    setStartTransaction(true);
  };

  return (
    <>
      <Header />
      <main>
        {user?.loading ? (
          <Loading />
        ) : user?.issuer ? (
          <div className="user-container">
            <UserInfo userInfo={user} />
            <MyButton text="Click Me" onClick={handleButtonClick} />
            <Logout setUser={setUser} />
          </div>
        ) : (
          <LoginForm setUser={setUser} />
        )}
      </main>

      <Footer />
    </>
  );
}

export default App;

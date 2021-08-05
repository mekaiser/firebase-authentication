import firebase from "firebase/app";
import "firebase/auth";
import { useState } from "react";
import "./App.css";
import firebaseConfig from "./firebase.config";

// firebase.initializeApp(firebaseConfig);

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

function App() {
  const [newUser, setNewUser] = useState(false);
  const [googleUser, setGoogleUser] = useState({
    isSignedIn: false,
    name: "",
    email: "",
    photo: "",
    error: "",
    success: false,
  });
  const [fbUser, setFbUser] = useState({
    isSignedIn: false,
    name: "",
    email: "",
    photo: "",
    error: "",
    success: false,
  });
  const [githubUser, setGithubUser] = useState({
    isSignedIn: false,
    name: "",
    email: "",
    photo: "",
    error: "",
    success: false,
  });

  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const fbProvider = new firebase.auth.FacebookAuthProvider();
  const gitHubProvider = new firebase.auth.GithubAuthProvider();
  
  const handleSignIn = () => {
    firebase
      .auth()
      .signInWithPopup(googleProvider)
      .then((res) => {
        const { displayName, photoURL, email } = res.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL,
          error: "",
          success: false,
          // notfix
        };
        setGoogleUser(signedInUser);
        console.log(displayName, email, photoURL);
      })
      .catch((err) => {
        console.log(err);
        console.log(err.message);
      });
  };

  const handleFbSignIn = () => {
    firebase
      .auth()
      .signInWithPopup(fbProvider)
      .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;
        var user = result.user;
        var accessToken = credential.accessToken;
        console.log("FB User After Sign In", user);
        
        const { displayName, photoURL, email } = user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL,
          error: "",
          success: false,
        };
        setFbUser(signedInUser);
      })
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;

        // ...
      });
  };

  const handleGitHubSignIn = () => {
    firebase
      .auth()
      .signInWithPopup(gitHubProvider)
      .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;
        var token = credential.accessToken;
        var user = result.user;
        console.log('github user', user);

        const { displayName, photoURL, email } = user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL,
          error: "",
          success: false,
        };
        setGithubUser(signedInUser);
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
        console.log('error', errorCode, errorMessage, email);
      });
  };

  const handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then((res) => {
        const signedOutUser = {
          isSignedIn: false,
          name: "",
          email: "",
          password: "",
          photo: "",
          error: "",
          success: false,
        };
        setGoogleUser(signedOutUser);
      })
      .catch((err) => {});
  };

  const handleBlur = (e) => {
    let isFieldValid = true;
    // console.log(e.target.name, e.target.value);
    if (e.target.name === "email") {
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
    }
    if (e.target.name === "password") {
      const isPasswordValid = e.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(e.target.value);
      isFieldValid = isPasswordValid && passwordHasNumber;
    }
    if (isFieldValid) {
      const newUserInfo = { ...googleUser };
      newUserInfo[e.target.name] = e.target.value;
      setGoogleUser(newUserInfo);
    }
  };

  const handleSubmit = (e) => {
    if (newUser && googleUser.email && googleUser.password) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(googleUser.email, googleUser.password)
        .then((userCredential) => {
          const newUserInfo = { ...googleUser };
          newUserInfo.error = "";
          newUserInfo.success = true;
          setGoogleUser(newUserInfo);
          updateUserName(googleUser.name);
        })
        .catch((error) => {
          const newUserInfo = { ...googleUser };
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setGoogleUser(newUserInfo);
        });
    }

    if (!newUser && googleUser.email && googleUser.password) {
      firebase
        .auth()
        .signInWithEmailAndPassword(googleUser.email, googleUser.password)
        .then((userCredential) => {
          const newUserInfo = { ...googleUser };
          newUserInfo.error = "";
          newUserInfo.success = true;
          setGoogleUser(newUserInfo);
          console.log("sign in user info", userCredential.user);
        })
        .catch((error) => {
          const newUserInfo = { ...googleUser };
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setGoogleUser(newUserInfo);
        });
    }

    e.preventDefault();
  };

  const updateUserName = (name) => {
    const user = firebase.auth().currentUser;

    user
      .updateProfile({
        displayName: name,
      })
      .then(() => {
        console.log("Username updated");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="App">
      {googleUser.isSignedIn ? (
        <button onClick={handleSignOut}>Sign out from Google</button>
      ) : (
        <button onClick={handleSignIn}>Sign in using Google</button>
      )}
      <br />
      <button onClick={handleFbSignIn}>Sign in using Facebook</button>
      <button onClick={handleGitHubSignIn}>Sign In using GitHub</button>
      {googleUser.isSignedIn && (
        <div>
          <p>Welcome, {googleUser.name} </p>
          <p>Your email: {googleUser.email} </p>
          <img src={googleUser.photo} alt={googleUser.name}></img>
        </div>
      )}
      {fbUser.isSignedIn && (
        <div>
          <p>Welcome, {fbUser.name} </p>
          <p>Your email: {fbUser.email} </p>
          <img src={fbUser.photo} alt={fbUser.name} />
        </div>
      )}
      {githubUser.isSignedIn && (
        <div>
          <p>Welcome, {githubUser.name} </p>
          <p>Your email: {githubUser.email} </p>
          <img src={githubUser.photo} alt={githubUser.name} />
        </div>
      )}
      <h1>Our Own Authentication System</h1>
      <input
        type="checkbox"
        onChange={() => setNewUser(!newUser)}
        name="newUser"
        id=""
      />
      <label htmlFor="newUser">New User Sign Up</label>

      <form onSubmit={handleSubmit}>
        {newUser && (
          <input
            type="text"
            name="name"
            onBlur={handleBlur}
            placeholder="Your name"
            required
          />
        )}
        <br />
        <input
          type="text"
          name="email"
          onBlur={handleBlur}
          placeholder="Your email address"
          required
        />
        <br />
        <input
          type="password"
          name="password"
          onBlur={handleBlur}
          placeholder="Your password"
          required
        />
        <br />
        <input type="submit" value={newUser ? "Sign up" : "Sign in"} />
      </form>
      {/* <p style={{ color: "red" }}> {user.error} </p>
      {
        user.success && <p style={{ color: "green" }}> User created successfully </p>
      } */}
      {googleUser.success ? (
        <p style={{ color: "green" }}>
          {" "}
          User {googleUser.name} {newUser ? "created" : "Logged In"} successfully{" "}
        </p>
      ) : (
        <p style={{ color: "red" }}> {googleUser.error} </p>
      )}
    </div>
  );
}

export default App;

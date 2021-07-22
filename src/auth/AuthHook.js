import React, { useState, useEffect, useContext, createContext } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import { initialiseUser, userExists } from "../firestore/UserInfo";

// NUStats Firebase credentials
firebase.initializeApp({
  apiKey: "AIzaSyABrfnbg4xbTWYVSDHcOwbIWfY8hIKvehY",
  authDomain: "nustats-74a18.firebaseapp.com",
  projectId: "nustats-74a18",
  storageBucket: "nustats-74a18.appspot.com",
  messagingSenderId: "968590483500",
  appId: "1:968590483500:web:53460c9c1a097e96f6b189",
});

const authContext = createContext();

const authProvider = new firebase.auth.GoogleAuthProvider();

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
  return useContext(authContext);
};

// Provider hook that creates auth object and handles state
function useProvideAuth() {
  const [user, setUser] = useState(null);

  // For Google sign ins
  const googleSignIn = () => {
    return firebase
      .auth()
      .signInWithPopup(authProvider)
      .then((response) => {
        setUser(response.user);
        return response.user;
      })
      .catch((error) => {});
  };

  // For email sign ins
  const signin = (email, password) => {
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        setUser(response.user);

        return response.user;
      })
      .catch((error) => {
        return null;
      });
  };

  // For email sign ups
  const signup = (username, email, password) => {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        initialiseUser(response.user.uid, username, email);
        setUser(response.user);
        return response.user;
      });
  };

  // Check if the email url link received is a sign in with email link
  const checkEmailLink = (emailLink) => {
    return firebase.auth().isSignInWithEmailLink(emailLink);
  };

  // Sends a sign in link to the given email address
  const sendEmailLink = (email) => {
    return firebase
      .auth()
      .sendSignInLinkToEmail(email, {
        url: "https://nustats-tobihy.vercel.app/Login",
        handleCodeInApp: true,
      })
      .then(() => {
        // Save the users email to verify it after they access their email
        window.localStorage.setItem("emailForSignIn", email);
        console.log("Email link sent");
      });
  };

  const passwordlessSignIn = (email, emailLink) => {
    const newUser = !userExists(email);
    return firebase
      .auth()
      .signInWithEmailLink(email, emailLink)
      .then((response) => {
        // Only for new users
        if (newUser === true) {
          initialiseUser(response.user.uid, email);
        }

        setUser(response.user);
        window.localStorage.removeItem("emailForSignIn");
        console.log("Passwordless sign in successful");
        return response.user;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const signout = () => {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        setUser(null);
      });
  };

  // Unused
  const sendPasswordResetEmail = (email) => {
    return firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        return true;
      });
  };

  // Unused
  const confirmPasswordReset = (code, password) => {
    return firebase
      .auth()
      .confirmPasswordReset(code, password)
      .then(() => {
        return true;
      });
  };

  // Subscribe to user on mount
  // Because this sets state in the callback it will cause any ...
  // ... component that utilizes this hook to re-render with the ...
  // ... latest auth object.
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Return the user object and auth methods
  return {
    user,
    googleSignIn,
    signin,
    signup,
    checkEmailLink,
    sendEmailLink,
    passwordlessSignIn,
    signout,
    sendPasswordResetEmail,
    confirmPasswordReset,
  };
}

export default firebase;

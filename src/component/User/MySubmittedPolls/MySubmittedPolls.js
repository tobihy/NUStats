import React from "react";
import ProfilePage from "../Parts/ProfilePage";
import firebase from "../../../auth/AuthHook";

function MySubmittedPolls() {
  return <ProfilePage uid={firebase.auth().currentUser?.uid} />;
}

export default MySubmittedPolls;

import React, { useEffect, useState } from "react";

import firebase, { useAuth } from "../auth/AuthHook";
import ProfilePage from "../component/User/Parts/ProfilePage";

import {
  // eslint-disable-next-line
  BrowserRouter as Router,
  Switch,
  Route,
  BrowserRouter,
} from "react-router-dom";

function PageHome(props) {
  const [avatarURL, setAvatarURL] = useState("");
  const [username, setUsername] = useState("");
  const auth = useAuth();
  const user = auth.user;

  return (
    <BrowserRouter>
      <main></main>
    </BrowserRouter>
  );
}

export default PageHome;

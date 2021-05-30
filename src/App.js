import React from "react";
import "./styles.css";

import AppShell from "./component/AppShell";
import PollManager from "./component/PollManager";
import PageLogin from "./pages/PageLogin";

import { useAuth } from "./hooks/AuthHook";

export default function App() {
  const auth = useAuth();
  const user = auth.user;

  return (
    <div className="App">
      <AppShell />
      <div className="Body" style={{ maxWidth: "64rem", margin: "0 auto" }}>
        {user ? <PollManager /> : <PageLogin />}
      </div>
    </div>
  );
}

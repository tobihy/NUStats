import React, { useState, useEffect } from "react";
import "./styles.css";

import AppShell from "./component/AppShell";
import { useAuth } from "./hooks/AuthHook";
import PageLogin from "./pages/PageLogin";
import PageHome from "./pages/PageHome";

export default function App() {
  const auth = useAuth();
  const user = auth.user;

  return (
    <div className="Bg">
      <AppShell />
      <div className="App">{!user ? <PageLogin /> : <PageHome />}</div>
    </div>
  );
}

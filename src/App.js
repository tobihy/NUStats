import styles from "./styles.css";

import { useAuth, ProvideAuth } from "./auth/AuthHook";
import { Switch, Route, Redirect, BrowserRouter } from "react-router-dom";
import PageLogin from "./pages/PageLogin";
import PageHome from "./pages/PageHome";

function AppBody() {
  const auth = useAuth();
  const user = auth.user;

  return (
    <>
      <div className={styles.App}>
        {user ? (
          <Redirect to={{ pathname: "/Dashboard" }} />
        ) : (
          <Redirect to={{ pathname: "/Login" }} />
        )}
      </div>
      <Switch>
        <Route path="/Dashboard" render={() => <PageHome />} />
        <Route path="/Login" render={() => <PageLogin />} />
      </Switch>
    </>
  );
}

export default function App() {
  return (
    <ProvideAuth>
      <BrowserRouter>
        <AppBody />
      </BrowserRouter>
    </ProvideAuth>
  );
}

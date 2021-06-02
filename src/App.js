import styles from "./styles.css";

import { useAuth, ProvideAuth } from "./auth/AuthHook";
import PageLogin from "./pages/PageLogin";
import PageHome from "./pages/PageHome";

function AppBody() {
  const auth = useAuth();
  const user = auth.user;

  return (
    <div className={styles.App}>{!user ? <PageLogin /> : <PageHome />}</div>
  );
}

export default function App() {
  return (
    <ProvideAuth>
      <AppBody />
    </ProvideAuth>
  );
}

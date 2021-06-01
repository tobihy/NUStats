import styles from "./styles.css";

import { useAuth } from "./auth/AuthHook";
import PageLogin from "./pages/PageLogin";
import PageHome from "./pages/PageHome";

export default function App() {
  const auth = useAuth();
  const user = auth.user;

  return (
    <div className={styles.App}>{!user ? <PageLogin /> : <PageHome />}</div>
  );
}

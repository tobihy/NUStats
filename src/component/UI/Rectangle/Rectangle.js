import { Paper } from "@material-ui/core";

import styles from "./Rectangle.module.css";

function Rectangle(props) {
  const { children } = props;
  return (
    <Paper className={styles.rectangle} elevation={3}>
      {children}
    </Paper>
  );
}

export default Rectangle;

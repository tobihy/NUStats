import { Paper } from "@material-ui/core";

import styles from "./Rectangle.module.css";

function Rectangle(props) {
  const { children } = props;
  return (
    <Paper className={styles.rectangle} square>
      {children}
    </Paper>
  );
}

export default Rectangle;

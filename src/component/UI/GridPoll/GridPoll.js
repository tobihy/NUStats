import { Grid } from "@material-ui/core";
import styles from "./GridPoll.module.css";

export function GridPoll(props) {
  return (
    <Grid container item xs={12} alignItems="center" className={styles.row}>
      <Grid item xs={10} sm={11}>
        {props.textField}
      </Grid>
      <Grid item xs={2} sm={1}>
        {props.button}
      </Grid>
    </Grid>
  );
}

export function GridPollTwo(props) {
  return (
    <Grid container item xs={12} justify="space-between" className={styles.row}>
      <Grid item xs={"auto"}>
        {props.first}
      </Grid>
      <Grid item xs={"auto"}>
        {props.second}
      </Grid>
    </Grid>
  );
}

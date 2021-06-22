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
<<<<<<< HEAD
      <Grid item xs={"auto"}>
        {props.first}
      </Grid>
      <Grid item xs={"auto"}>
        {props.second}
=======
      <Grid item xs={6}>
        {props.first}
      </Grid>
      <Grid item xs={6}>
        {props.third}
>>>>>>> 93efff648338c14e63e0520c8a02d8cd71c76598
      </Grid>
    </Grid>
  );
}

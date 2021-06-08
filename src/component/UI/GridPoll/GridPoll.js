import { Grid } from "@material-ui/core";
import styles from "./GridPoll.module.css";

export default function GridPoll(props) {
  return (
    <div className={styles.wrapper}>
      <Grid
        container
        item
        xs={12}
        alignItems="center"
        className={props.row && styles.row}
      >
        <Grid item xs={11}>
          {props.textField}
        </Grid>
        <Grid container item xs={1}>
          <Grid item xs={2}></Grid>
          <Grid item xs={5}>
            {props.button}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

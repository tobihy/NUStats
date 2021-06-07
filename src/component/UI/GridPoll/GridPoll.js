import { Grid } from "@material-ui/core";
import styles from "./GridPoll.module.css";

export default function GridBox(props) {
  return (
    <Grid
      container
      item
      xs={12}
      alignItems="center"
      className={props.row && styles.row}
    >
      <Grid item md={3} xs={2}></Grid>
      <Grid item container md={6} xs={10}>
        <Grid item md={10} xs={8}>
          {props.textField}
        </Grid>
        <Grid container item md={2} xs={4}>
          <Grid item xs={"auto"} md={2}></Grid>
          <Grid item xs={11} md={10}>
            {props.button}
          </Grid>
        </Grid>
      </Grid>
      <Grid item md={1} xs={1}></Grid>
    </Grid>
  );
}

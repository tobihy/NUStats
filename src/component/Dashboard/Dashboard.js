import { Grid, Typography, List, ListItemText } from "@material-ui/core";
import Rectangle from "../UI/Rectangle";

import styles from "./Dashboard.module.css";

function Dashboard(props) {
  const { submittedPolls } = props;

  const GridRectangle = (props) => (
    <Grid item xs={12} sm={6}>
      <Rectangle>
        <Typography variant="h5">{props.title}</Typography>
        <List>{props.list}</List>
      </Rectangle>
    </Grid>
  );

  return (
    <div className={styles.wrapper}>
      <Grid container>
        <GridRectangle
          title={"Trending Polls"}
          list={submittedPolls.map((poll) => (
            <ListItemText key={poll.id}>{poll.description}</ListItemText>
          ))}
        />
        <GridRectangle
          title={"My Polls"}
          list={submittedPolls.map((poll) => (
            <ListItemText key={poll.id}>{poll.description}</ListItemText>
          ))}
        />
        <GridRectangle
          title={"Number of Polls Answered"}
          list={submittedPolls.map((poll) => (
            <ListItemText key={poll.id}>{poll.description}</ListItemText>
          ))}
        />
        <GridRectangle
          title={"Did you know..."}
          list={submittedPolls.map((poll) => (
            <ListItemText key={poll.id}>{poll.description}</ListItemText>
          ))}
        />
      </Grid>
    </div>
  );
}

export default Dashboard;

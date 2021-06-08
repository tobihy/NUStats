import { Grid, Typography, List, ListItemText } from "@material-ui/core";
import Rectangle from "../UI/Rectangle";
import { useAuth } from "../../auth/AuthHook";

import styles from "./Dashboard.module.css";

function Dashboard(props) {
  const { submittedPolls } = props;
  const user = useAuth().user;

  const GridRectangle = (props) => (
    <Grid item xs={12} sm={6}>
      <Rectangle>
        <Typography variant="h5">{props.title}</Typography>
        {props.content}
      </Rectangle>
    </Grid>
  );

  return (
    <div className={styles.wrapper}>
      <Grid container>
        <GridRectangle
          title={"Trending Polls"}
          content={
            <List>
              {submittedPolls.map((poll) => (
                <ListItemText key={poll.id}>{poll.description}</ListItemText>
              ))}
            </List>
          }
        />
        <GridRectangle
          title={"My Polls"}
          content={
            <List>
              {submittedPolls
                .filter((poll) => {
                  return poll.author === user;
                })
                .map((poll) => (
                  <ListItemText key={poll.id}>{poll.description}</ListItemText>
                ))}
            </List>
          }
        />
        <GridRectangle
          title={"Number of Polls Answered"}
          list={submittedPolls.map((poll) => (
            <ListItemText key={poll.id}>{poll.description}</ListItemText>
          ))}
        />
        <GridRectangle
          title={"Did you know?"}
          list={submittedPolls.map((poll) => (
            <ListItemText key={poll.id}>{poll.description}</ListItemText>
          ))}
        />
      </Grid>
    </div>
  );
}

export default Dashboard;

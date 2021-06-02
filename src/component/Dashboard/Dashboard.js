import {
  Card,
  CardContent,
  Typography,
  List,
  ListItemText,
} from "@material-ui/core";

import styles from "./Dashboard.module.css";

function Dashboard(props) {
  const { submittedPolls } = props;

  return (
    <div className={styles.grid}>
      <Card className={styles.card}>
        <CardContent>
          <Typography variant="h5">Trending Polls</Typography>
          <List>
            {submittedPolls.map((poll) => (
              <ListItemText>{poll.description}</ListItemText>
            ))}
          </List>
        </CardContent>
      </Card>
      <Card className={styles.card}>
        <CardContent>
          <Typography variant="h5">My Polls</Typography>
          <List>
            {submittedPolls.map((poll) => (
              <ListItemText>{poll.description}</ListItemText>
            ))}
          </List>
        </CardContent>
      </Card>
      <Card className={styles.card}>
        <CardContent>
          <Typography variant="h5">Number of polls answered</Typography>
          <List>
            {submittedPolls.map((poll) => (
              <ListItemText>{poll.description}</ListItemText>
            ))}
          </List>
        </CardContent>
      </Card>
      <Card className={styles.card}>
        <CardContent>
          <Typography variant="h5">Did you know...</Typography>
          <List>
            {submittedPolls.map((poll) => (
              <ListItemText>{poll.description}</ListItemText>
            ))}
          </List>
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;

import React, { useEffect, useState } from "react";
import firebase from "../../../../auth/AuthHook";
import {
  Grid,
  Typography,
  Avatar,
  makeStyles,
  Button,
  ButtonGroup,
} from "@material-ui/core";
import PollWrapper from "../PollWrapper";
//eslint-disable-next-line
import { useParams, BrowserRouter as Route, Link } from "react-router-dom";
import { fsFollow, fsUnfollow } from "../../../../firestore/Follow";
import SortMenu from "../../Parts/SortMenu";

function ProfilePage(props) {
  const [mySubmittedPolls, setMySubmittedPolls] = useState([]);
  const [username, setUsername] = useState("");
  const [avatarURL, setAvatarURL] = useState("");
  const [followingCount, setFollowingCount] = useState(0);
  const [followerCount, setFollowersCount] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [followed, setFollowed] = useState(false);
  const { userId } = useParams();

  const useStyles = makeStyles((theme) => ({
    sizeAvatar: {
      height: theme.spacing(15),
      width: theme.spacing(15),
      marginLeft: "auto",
      marginRight: "auto",
    },
  }));

  const classes = useStyles();

  useEffect(() => {
    const uid = props.uid || userId;
    const db = firebase.firestore();

    const userRef = firebase.firestore().collection("userInfo").doc(uid).get();

    userRef.then((doc) => {
      setFollowersCount(doc.data().followers.length);
      setFollowingCount(doc.data().followings.length);
      setFollowed(
        doc.data().followers.includes(firebase.auth().currentUser?.uid)
      );
      if (doc.exists) {
        setUsername(doc.data().username);
        if (doc.data().profilepic !== undefined) {
          setAvatarURL(doc.data().profilepic);
        }
      }
    }, []);

    const filtered = db
      .collection("draftSubmittedPolls")
      .where("creator", "==", uid);

    const sorted =
      selectedIndex < 2
        ? filtered.orderBy(
            "submissionTime",
            selectedIndex === 0 ? "desc" : "asc"
          )
        : selectedIndex < 4
        ? filtered.orderBy("pollCount", selectedIndex === 2 ? "desc" : "asc")
        : selectedIndex < 6
        ? filtered.orderBy("likesCount", selectedIndex === 4 ? "desc" : "asc")
        : filtered.orderBy("description", selectedIndex === 6 ? "asc" : "desc");

    sorted.get().then((querySnapshot) => {
      const tempDocs = [];
      querySnapshot.forEach((pollRef) => {
        const { responses, uids, ...otherProps } = pollRef.data();
        const filtered = responses.filter((response) => response.uid === uid);
        if (filtered.length === 0) {
          tempDocs.push({
            id: pollRef.id,
            ...otherProps,
            completed: false,
          });
        } else {
          tempDocs.push({
            id: pollRef.id,
            ...otherProps,
            completed: true,
            optionId: filtered.pop().optionId,
          });
        }
      });
      setMySubmittedPolls(tempDocs);
    });
  }, [props.uid, userId, selectedIndex]);

  const followButton = () => {
    if (userId !== undefined && userId !== firebase.auth().currentUser?.uid) {
      console.log(userId, firebase.auth().currentUser?.uid);
      return (
        <Grid item xs="auto">
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              if (followed) {
                fsUnfollow(userId);
                setFollowed(false);
                setFollowersCount(followerCount - 1);
              } else {
                fsFollow(userId);
                setFollowed(true);
                setFollowersCount(followerCount + 1);
              }
            }}
          >
            {followed ? "Following" : "Follow"}
          </Button>
        </Grid>
      );
    }
  };

  return (
    <>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="stretch"
        spacing={2}
      >
        <Grid item xs={12}>
          <Avatar
            alt={username}
            src={avatarURL}
            className={classes.sizeAvatar}
          />
        </Grid>
        <Grid item container xs={12} justify="center" spacing={2}>
          <Grid item xs="auto">
            <Typography variant="h5" align="center">
              {username}
            </Typography>
          </Grid>
          {followButton()}
        </Grid>
        <Grid item container xs={12} justify="center" spacing={2}>
          <Grid item xs="auto">
            <ButtonGroup variant="text">
              <Button
                style={{
                  textTransform: "none",
                  lineHeight: "1rem",
                  textAlign: "center",
                }}
                component={Link}
                to={(userId === undefined ? "/Profile" : userId) + "/Followers"}
              >
                <Grid container direction="column" spacing={0}>
                  <Grid item>{followerCount}</Grid>
                  <Grid item>Followers</Grid>
                </Grid>
              </Button>
              <Button
                style={{
                  textTransform: "none",
                  lineHeight: "1rem",
                  textAlign: "center",
                }}
                component={Link}
                to={(userId === undefined ? "/Profile" : userId) + "/Following"}
              >
                <Grid container direction="column" spacing={0}>
                  <Grid item>{followingCount}</Grid>
                  <Grid item>Following</Grid>
                </Grid>
              </Button>
            </ButtonGroup>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <SortMenu
            setSelectedIndex={setSelectedIndex}
            selectedIndex={selectedIndex}
            filter={false}
          />
        </Grid>
        {mySubmittedPolls.length === 0 ? (
          <Typography variant="body1" align="center">
            {username} has not submitted any polls.
          </Typography>
        ) : (
          mySubmittedPolls.map((poll) => (
            <PollWrapper poll={poll} key={poll.id} />
          ))
        )}
      </Grid>
    </>
  );
}

export default ProfilePage;

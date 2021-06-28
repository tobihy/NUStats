import React, { useState, useCallback, useRef, useEffect } from "react";
import ReactCrop from "react-image-crop";
import firebase from "../../auth/AuthHook";
import {
  Avatar,
  Button,
  TextField,
  Grid,
  makeStyles,
  Container,
} from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";
import "react-image-crop/dist/ReactCrop.css";
import SnackBar from "../UI/SnackBar";
import styles from "./Settings.module.css";
import CropIcon from "@material-ui/icons/Crop";
import UndoIcon from "@material-ui/icons/Undo";

function Settings(props) {
  const { username, setUsername, avatarURL, setAvatarURL } = props;
  const [currUsername, setCurrUsername] = useState(username);
  const [hide, setHide] = useState(false);
  const uid = firebase.auth().currentUser?.uid;

  const useStyles = makeStyles((theme) => ({
    sizeAvatar: {
      height: theme.spacing(20),
      width: theme.spacing(20),
      marginLeft: "auto",
      marginRight: "auto",
    },
  }));

  const classes = useStyles();

  const handleChangeUsername = (event) => setUsername(event.target.value);

  const handleSaveSettings = (event) => {
    event.preventDefault();
    const userRef = firebase.firestore().collection("userInfo").doc(uid);
    const saveToFS = async () => {
      firebase
        .storage()
        .ref()
        .child("profilepics/" + uid + ".jpg")
        .put(file)
        .then(() =>
          firebase
            .storage()
            .ref("profilepics")
            .child(uid + "_200x200.jpeg")
            .getDownloadURL()
            .then((url) => {
              userRef
                .update({
                  username: username,
                  profilepic: url,
                })
                .then(() => {})
                .catch((error) =>
                  console.error("Error Saving Settings", error)
                );
              firebase
                .firestore()
                .collection("usernames")
                .doc(username)
                .set({ count: 1 });
              firebase
                .firestore()
                .collection("usernames")
                .doc(currUsername)
                .delete();
              setAvatarURL(fileLink);
              setFileLink(fileLink);
              setCurrUsername(username);
              snackBar("Settings saved!", "success");
            })
        );
    };
    if (username !== currUsername) {
      firebase
        .firestore()
        .collection("usernames")
        .doc(username.toLowerCase())
        .get()
        .then((doc) => {
          if (doc.exists) {
            snackBar("Username taken, please choose another one", "error");
          } else {
            saveToFS();
          }
        });
    } else {
      saveToFS();
    }
  };

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");

  function snackBar(message, severity) {
    setMessage(message);
    setSeverity(severity);
    setOpen(true);
  }

  const [file, setFile] = useState("");
  const [fileLink, setFileLink] = useState("");
  const [upImg, setUpImg] = useState();
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [crop, setCrop] = useState({ unit: "%", width: 30, aspect: 1 });
  const [completedCrop, setCompletedCrop] = useState(null);

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => setUpImg(reader.result));
      reader.readAsDataURL(e.target.files[0]);
      setHide(false);
    }
  };

  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  function generateDownload(canvas, crop) {
    setHide(true);
    if (!crop || !canvas) {
      return;
    }

    canvas.toBlob((blob) => {
      const file = new File([blob], uid + ".jpg", {
        type: "image/jpeg",
        lastModified: Date.now(),
      });
      const reader = new FileReader();
      reader.onloadend = function () {
        setFileLink(reader.result);
      };
      if (file) {
        reader.readAsDataURL(file);
        setUpImg();
        setFile(file);
      } else {
        setFileLink("");
      }
    });
  }

  function undo() {
    setFileLink(avatarURL);
  }

  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

    const image = imgRef.current;

    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");
    const pixelRatio = window.devicePixelRatio / 2;

    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";
    if (upImg !== null) {
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );
    }
  }, [completedCrop, upImg]);

  function usernameError(username) {
    if (username.length === 0 || username.length > 30) {
      return true;
    }
    return false;
  }

  function usernameHelperText(username) {
    if (username.length === 0) {
      return "Empty username is not allowed";
    } else if (username.length > 30) {
      return "Username length (30 characters) exceeded";
    }
    return "";
  }

  return (
    <Container maxWidth="sm">
      <Grid container spacing={3} justify="center">
        <Grid item xs={12}>
          <TextField
            type="text"
            value={username}
            label="Username"
            error={usernameError(username)}
            helperText={usernameHelperText(username)}
            onChange={handleChangeUsername}
            fullWidth
          />
        </Grid>
        <Grid item container xs={12} spacing={2}>
          <Grid item xs={12} sm={6}>
            <Button variant="contained" color="primary" fullWidth>
              <label>
                Change Picture
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={onSelectFile}
                />
              </label>
            </Button>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button
              type="button"
              variant="contained"
              color="primary"
              disabled={!completedCrop?.width || !completedCrop?.height || hide}
              onClick={() =>
                generateDownload(previewCanvasRef.current, completedCrop)
              }
              endIcon={<CropIcon />}
              fullWidth
            >
              Crop
            </Button>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button
              type="button"
              variant="contained"
              color="primary"
              disabled={avatarURL === fileLink}
              onClick={() => undo()}
              endIcon={<UndoIcon />}
              fullWidth
            >
              Undo
            </Button>
          </Grid>
        </Grid>
        <Grid item xs={10}>
          {hide ? null : (
            <ReactCrop
              className={styles.crop}
              src={upImg}
              onImageLoaded={onLoad}
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              circularCrop
            />
          )}
          <canvas ref={previewCanvasRef} hidden />
          {fileLink === "" ? (
            avatarURL.length > 30 ? (
              <Avatar
                alt={username}
                src={avatarURL}
                className={classes.sizeAvatar}
              />
            ) : (
              <Avatar className={classes.sizeAvatar}>
                <PersonIcon className={classes.sizeAvatar} />
              </Avatar>
            )
          ) : (
            <Avatar
              alt={username}
              src={fileLink}
              className={classes.sizeAvatar}
            />
          )}
        </Grid>
        <Grid container item xs={12} justify="center">
          <Grid item xs={6}>
            <form>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={
                  (currUsername === username && avatarURL === fileLink) ||
                  usernameError(username, currUsername) ||
                  !hide
                }
                onClick={handleSaveSettings}
                fullWidth
              >
                Save Settings
              </Button>
            </form>
          </Grid>
        </Grid>
        <SnackBar
          open={open}
          message={message}
          setOpen={setOpen}
          severity={severity}
        />
      </Grid>
    </Container>
  );
}

export default Settings;

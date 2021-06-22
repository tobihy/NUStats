import React, { useState, useCallback, useRef, useEffect } from "react";
import ReactCrop from "react-image-crop";
import firebase from "../../auth/AuthHook";
import { Avatar, Button, TextField, Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import PersonIcon from "@material-ui/icons/Person";
import "react-image-crop/dist/ReactCrop.css";

function Settings() {
  const [username, setUsername] = useState("");
  // eslint-disable-next-line
  const [avatar, setAvatar] = useState("");
  const [avatarURL, setAvatarURL] = useState("");
  const uid = firebase.auth().currentUser?.uid;

  useEffect(() => {
    const userRef = firebase.firestore().collection("userInfo").doc(uid).get();

    userRef.then((doc) => {
      setUsername(doc.data().username);
      doc.data().profilepic &&
        firebase
          .storage()
          .ref("profilepics")
          .child(uid + "_200x200.jpeg")
          .getDownloadURL()
          .then((url) => {
            console.log(url);
            setAvatarURL(url);
          });
    });
  }, [uid]);

  const handleChangeUsername = (event) => setUsername(event.target.value);

  const handleSaveSettings = (event) => {
    event.preventDefault();
    snackBar("success", "Settings saved!");
    const userRef = firebase.firestore().collection("userInfo").doc(uid);
    firebase
      .storage()
      .ref()
      .child("profilepics/" + uid + ".jpg")
      .put(file)
      .then(() => console.log("imageuploaded"));
    userRef
      .update({
        username: username,
        profilepic: true,
      })
      .then(() => {
        console.log("Saved Settings");
      })
      .catch((error) => console.error("Error Saving Settings", error));
  };

  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("sucesss");
  const [message, setMessage] = useState("");

  const snackBar = (s, m) => {
    setSeverity(s);
    setMessage(m);
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const useStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
      "& > * + *": {
        marginTop: theme.spacing(2),
      },
    },
  }));

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }
  const classes = useStyles();
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
    }
  };

  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  function generateDownload(canvas, crop) {
    console.log("canvas", canvas);
    console.log("crop", crop);
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
    const pixelRatio = window.devicePixelRatio;

    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

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
  }, [completedCrop]);

  return (
    <>
      <div>
        <form>
          <TextField
            type="text"
            value={username}
            label="Username"
            onChange={handleChangeUsername}
          />
          <Button variant="contained" color="primary">
            <label>
              Upload Picture
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={onSelectFile}
              />
            </label>
          </Button>
          <ReactCrop
            src={upImg}
            onImageLoaded={onLoad}
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            circularCrop
          />
          <canvas ref={previewCanvasRef} hidden />
          {fileLink === "" ? (
            avatarURL.length > 30 ? (
              <Avatar src={avatarURL} alt={username} />
            ) : (
              <Avatar>
                <PersonIcon />
              </Avatar>
            )
          ) : (
            <Avatar src={fileLink} alt={username} />
          )}
          <Button
            type="button"
            variant="contained"
            color="primary"
            disabled={!completedCrop?.width || !completedCrop?.height}
            onClick={() =>
              generateDownload(previewCanvasRef.current, completedCrop)
            }
          >
            Crop
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={handleSaveSettings}
          >
            Save Settings
          </Button>
        </form>
      </div>
      <div className={classes.root}>
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
          <Alert onClose={handleClose} severity={severity}>
            {message}
          </Alert>
        </Snackbar>
      </div>
    </>
  );
}

export default Settings;

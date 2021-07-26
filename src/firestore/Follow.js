import firebase from "../auth/AuthHook";

const fsFollow = (followId) => {
  const userId = firebase.auth().currentUser?.uid;
  const userRef = firebase.firestore().collection("userInfo").doc(userId);
  const followRef = firebase.firestore().collection("userInfo").doc(followId);

  const data = {
    followings: firebase.firestore.FieldValue.arrayUnion(followId),
  };

  userRef
    .update(data)
    .then(() => {})
    .catch((error) => console.error("Error following"));

  const followerData = {
    followers: firebase.firestore.FieldValue.arrayUnion(userId),
  };

  followRef
    .update(followerData)
    .then(() => {})
    .catch((error) => console.error("Error following2"));
};

const fsUnfollow = (followId) => {
  const userId = firebase.auth().currentUser?.uid;
  const userRef = firebase.firestore().collection("userInfo").doc(userId);
  const followRef = firebase.firestore().collection("userInfo").doc(followId);

  const data = {
    followings: firebase.firestore.FieldValue.arrayRemove(followId),
  };

  userRef
    .update(data)
    .then(() => {})
    .catch((error) => console.error("Error unfollowing"));

  const followerData = {
    followers: firebase.firestore.FieldValue.arrayRemove(userId),
  };

  followRef
    .update(followerData)
    .then(() => {})
    .catch((error) => console.error("Error unfollowing2"));
};

export { fsFollow, fsUnfollow };

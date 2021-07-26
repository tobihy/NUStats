import firebase from "../auth/AuthHook";

const fsLike = (pollId) => {
  const uid = firebase.auth().currentUser?.uid;
  const submittedPollsRef = firebase
    .firestore()
    .collection("draftSubmittedPolls")
    .doc(pollId);

  const data = {
    likesCount: firebase.firestore.FieldValue.increment(1),
    likes: firebase.firestore.FieldValue.arrayUnion(uid),
  };

  submittedPollsRef
    .update(data)
    .then(() => {})
    .catch((error) => console.error("Error liking"));
};

const fsUnlike = (pollId) => {
  const uid = firebase.auth().currentUser?.uid;
  const submittedPollsRef = firebase
    .firestore()
    .collection("draftSubmittedPolls")
    .doc(pollId);

  const data = {
    likesCount: firebase.firestore.FieldValue.increment(-1),
    likes: firebase.firestore.FieldValue.arrayRemove(uid),
  };

  submittedPollsRef
    .update(data)
    .then(() => {})
    .catch((error) => console.error("Error unliking"));
};

export { fsLike, fsUnlike };

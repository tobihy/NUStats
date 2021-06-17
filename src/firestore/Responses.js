import firebase from "../auth/AuthHook";

const fsSubmitResponse = (pollId, optionId) => {
  const uid = firebase.auth().currentUser?.uid;
  const submittedPollsRef = firebase
    .firestore()
    .collection("draftSubmittedPolls")
    .doc(pollId);

  submittedPollsRef
    .update({
      pollCount: firebase.firestore.FieldValue.increment(1),
      uids: firebase.firestore.FieldValue.arrayUnion(uid),
      responses: firebase.firestore.FieldValue.arrayUnion({
        uid: uid,
        optionId: optionId,
      }),
    })
    .then(() => {
      console.log("Poll Count incremented");
    })
    .catch((error) => console.error("Error incrementing poll count"));

  submittedPollsRef
    .collection("options")
    .doc(optionId.toString())
    .update({
      optionCount: firebase.firestore.FieldValue.increment(1),
    })
    .then(() => {
      console.log("Option count incremented");
    })
    .catch((error) => console.error("Error incrementing option count"));

  const userRef = firebase.firestore().collection("userInfo").doc(uid);

  userRef
    .update({
      completionCount: firebase.firestore.FieldValue.increment(1),
    })
    .then(() => {
      console.log("User completion count incremented");
    })
    .catch((error) =>
      console.error("Error incrementing user completion count", error)
    );
};

export { fsSubmitResponse };

import firebase from "../auth/AuthHook";

const fsSubmitResponse = (pollId, optionId) => {
  const uid = firebase.auth().currentUser?.uid;
  const submittedPollsRef = firebase
    .firestore()
    .collection("draftSubmittedPolls")
    .doc(pollId);

  const data = {
    pollCount: firebase.firestore.FieldValue.increment(1),
    uids: firebase.firestore.FieldValue.arrayUnion(uid),
    responses: firebase.firestore.FieldValue.arrayUnion({
      uid: uid,
      optionId: optionId,
    }),
  };

  data["optionCounts." + optionId.toString()] =
    firebase.firestore.FieldValue.increment(1);

  submittedPollsRef
    .update(data)
    .then(() => {})
    .catch((error) =>
      console.error(
        "Error incrementing poll count",
        uid,
        " ",
        pollId,
        " ",
        optionId
      )
    );

  const userRef = firebase.firestore().collection("userInfo").doc(uid);

  userRef
    .update({
      completionCount: firebase.firestore.FieldValue.increment(1),
    })
    .then(() => {})
    .catch((error) =>
      console.error("Error incrementing user completion count", error)
    );
};

export { fsSubmitResponse };

import firebase from "../auth/AuthHook";

async function fsSubmitPoll(p) {
  const uid = firebase.auth().currentUser?.uid;
  const submittedPollsRef = firebase
    .firestore()
    .collection("draftSubmittedPolls");
  const { id, update, ...otherProps } = p;
  const optionCounts = {};
  p.options.forEach((option, index) => (optionCounts[index.toString()] = 0));
  submittedPollsRef
    .add({
      ...otherProps,
      optionCounts: optionCounts,
      pollCount: 0,
      creator: uid,
      submissionTime: firebase.firestore.FieldValue.serverTimestamp(),
      responses: [],
      uids: [],
      likes: [],
      likesCount: 0,
      searchQns: p.description.toLowerCase(),
    })
    .then((docRef) => {})
    .catch((error) =>
      console.error("Error submitting poll " + p.description + " ", error)
    );
}

export { fsSubmitPoll };

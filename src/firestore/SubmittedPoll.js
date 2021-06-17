import firebase from "../auth/AuthHook";

async function fsSubmitPoll(p) {
  const uid = firebase.auth().currentUser?.uid;
  const submittedPollsRef = firebase
    .firestore()
    .collection("draftSubmittedPolls");
  var id = "";
  await submittedPollsRef
    .add({
      description: p.description,
      pollCount: 0,
      creator: uid,
      submissionTime: firebase.firestore.FieldValue.serverTimestamp(),
      options: p.options,
      responses: [],
      uids: [],
    })
    .then((docRef) => {
      id = docRef.id;
      console.log("Poll Submitted: " + p.description);
    })
    .catch((error) =>
      console.error("Error submitting poll " + p.description + " ", error)
    );
  const optionsRef = submittedPollsRef.doc(id).collection("options");
  p.options.forEach((o) =>
    optionsRef.doc(o.id.toString()).set({ optionCount: 0 })
  );
}

export { fsSubmitPoll };

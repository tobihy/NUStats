import firebase from "../auth/AuthHook";

const fsDeletePoll = (poll) => {
  const uid = firebase.auth().currentUser?.uid;
  const pollsRef = firebase
    .firestore()
    .collection("userInfo")
    .doc(uid)
    .collection("draftPolls");
  pollsRef
    .doc(poll.id)
    .delete()
    .then(() => {})
    .catch((error) => {
      console.error("Error deleting Poll " + poll.description, error);
    });
};

function fsAddPoll(poll, polls, setPolls) {
  const uid = firebase.auth().currentUser?.uid;
  const pollsRef = firebase
    .firestore()
    .collection("userInfo")
    .doc(uid)
    .collection("draftPolls");
  pollsRef
    .add(poll)
    .then((docRef) => {
      const newPolls = [
        {
          id: docRef.id,
          ...poll,
        },
        ...polls,
      ];
      setPolls(newPolls);
    })
    .catch((error) => {
      console.error("Error adding poll " + poll.description + " ", error);
    });
}

const fsUpdatePoll = (poll) => {
  console.log("updated");
  const uid = firebase.auth().currentUser?.uid;
  const pollsRef = firebase
    .firestore()
    .collection("userInfo")
    .doc(uid)
    .collection("draftPolls");
  pollsRef
    .doc(poll.id)
    .update({
      description: poll.description,
      options: poll.options,
      updated: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .catch((error) => {
      console.error("Error updating poll " + JSON.stringify(poll) + " ", error);
    });
};

export { fsDeletePoll, fsAddPoll, fsUpdatePoll };

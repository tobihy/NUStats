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
    .then(() => {
      console.log("Poll " + poll.description + " deleted");
    })
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
      console.log("Poll added " + poll.description + " ");
    })
    .catch((error) => {
      console.error("Error adding poll " + poll.description + " ", error);
    });
}

const fsUpdatePoll = (poll) => {
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
    .then(() => console.log("Poll updated " + JSON.stringify(poll)))
    .catch((error) => {
      console.error("Error updating poll " + JSON.stringify(poll) + " ", error);
    });
};

export { fsDeletePoll, fsAddPoll, fsUpdatePoll };

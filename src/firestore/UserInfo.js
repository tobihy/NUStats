import firebase from "../auth/AuthHook";

const date = new Date();
const currMonth = date.getMonth();

const initArr = [
  { month: "Jan", polls: 0 },
  { month: "Feb", polls: 0 },
  { month: "Mar", polls: 0 },
  { month: "Apr", polls: 0 },
  { month: "May", polls: 0 },
  { month: "Jun", polls: 0 },
  { month: "Jul", polls: 0 },
  { month: "Aug", polls: 0 },
  { month: "Sep", polls: 0 },
  { month: "Oct", polls: 0 },
  { month: "Nov", polls: 0 },
  { month: "Dec", polls: 0 },
];

export const initialiseUser = (uid, email) => {
  // Sets the username to be the user's email
  const defaultUsername = email;

  // Updates the collection of usernames in use
  firebase
    .firestore()
    .collection("usernames")
    .doc(defaultUsername)
    .set({ count: 1 });

  // Updates the collection of emails in use
  firebase.firestore().collection("emails").doc(email).set({ count: 1 });

  // Updates the user's information
  firebase.firestore().collection("userInfo").doc(uid).set({
    username: defaultUsername,
    email: email,
    monthArr: initArr,
    followings: [],
  });

  console.log("user initialized");
};

export default function updateSubmitCount(uid) {
  const userInfoRef = firebase.firestore().collection("userInfo").doc(uid);
  userInfoRef.get().then((doc) => {
    var updateArr = doc.data().monthArr;
    updateArr[currMonth].polls++;
    userInfoRef.update({ monthArr: updateArr });
  });
}

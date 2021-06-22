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

export const initialiseSubmitCount = (uid) => {
  firebase
    .firestore()
    .collection("userInfo")
    .doc(uid)
    .set({ monthArr: initArr, total: 0 });
};

export default function updateSubmitCount(uid) {
  const userInfoRef = firebase.firestore().collection("userInfo").doc(uid);
  userInfoRef.get().then((doc) => {
    if (!doc.exists) {
      initialiseSubmitCount(uid);
    }
    var updateArr = doc.data().monthArr;
    updateArr[currMonth].polls++;
<<<<<<< HEAD
    userInfoRef.update({
      monthArr: updateArr,
      total: firebase.firestore.FieldValue.increment(1),
    });
=======
    userInfoRef.set({ monthArr: updateArr });
    userInfoRef.update({ total: firebase.firestore.FieldValue.increment(1) });
>>>>>>> 93efff648338c14e63e0520c8a02d8cd71c76598
  });
}

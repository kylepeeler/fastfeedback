import firebase from './firebase';

const firestore = firebase.firestore();

export function createUser(uid, data) {
  console.log('create the user', uid, data);
  return firestore
    .collection('users')
    .doc(uid)
    .set({ uid, ...data }, { merge: true });
}

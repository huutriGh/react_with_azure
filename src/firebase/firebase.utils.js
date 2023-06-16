import firebase from 'firebase/app';

import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const config = {
  apiKey: 'AIzaSyDP47icY1_e6ZC0ldyW81_HSz1Z7c9jjyE',
  authDomain: 'caportal-331608.firebaseapp.com',
};
const app = firebase.initializeApp(config);

export const getCurrentUser = () => {
  return new Promise((resovle, reject) => {
    const unsubscribe = auth.onAuthStateChanged((userAuth) => {
      unsubscribe();
      resovle(userAuth);
    }, reject);
  });
};
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

export default app;

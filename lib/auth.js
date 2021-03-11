import React, { useState, useEffect, useContext, createContext } from 'react';
import firebase from './firebase';

import { createUser } from './db';

const authContext = createContext();

export const AuthProvider = ({ children }) => {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

export const useAuth = () => {
  return useContext(authContext);
};

const formatUser = (user) => {
  return {
    uid: user.uid,
    email: user.email,
    name: user.displayName,
    provider: user.providerData[0].providerId,
    photoUrl: user.photoURL
  };
};

const useProvideAuth = () => {
  const [user, setUser] = useState(null);

  console.log(user);

  const handleUser = (rawUser) => {
    if (rawUser) {
      const user = formatUser(rawUser);

      console.log('got back user as ', user);
      createUser(user.uid, user);
      setUser(user);
      return user;
    } else {
      setUser(false);
      return false;
    }
  };

  const signInWithGitHub = async () => {
    return firebase
      .auth()
      .signInWithPopup(new firebase.auth.GithubAuthProvider())
      .then((response) => handleUser(response.user));
  };

  const signout = async () => {
    return firebase
      .auth()
      .signOut()
      .then(() => handleUser(false));
  };

  useEffect(() => {
    const unsubscribe = firebase
      .auth()
      .onAuthStateChanged((response) => handleUser(response));

    return () => unsubscribe();
  }, []);

  return {
    user,
    signInWithGitHub,
    signout
  };
};

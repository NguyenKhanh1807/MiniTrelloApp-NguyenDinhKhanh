import admin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json' assert { type: 'json' };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://minitrelloapp-948be-default-rtdb.firebaseio.com/'
});

const db = admin.firestore();

export { admin, db };
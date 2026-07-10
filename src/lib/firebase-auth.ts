import { getAuth } from 'firebase/auth'
import { app } from './firebase'

// Split from firebase.ts so the public site (which only needs Firestore for
// reading videos) doesn't pull the Auth SDK into its bundle — only the
// admin panel imports this module.
export const auth = getAuth(app)

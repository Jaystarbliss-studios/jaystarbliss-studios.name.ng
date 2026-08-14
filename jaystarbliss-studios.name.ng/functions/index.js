const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

// 3.1 Paystack Integration
exports.initializePayment = functions.https.onCall(async (data, context) => {
  const { studentId, parentId, amount, plan } = data;
  
  // Call Paystack API here in real implementation. For now, simulate.
  const paystackRef = 'REF_' + Date.now();
  
  await db.collection('transactions').add({
    studentId,
    parentId,
    tutorId: null,
    amount,
    currency: 'NGN',
    status: 'pending',
    type: 'lesson',
    paystackRef,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    completedAt: null
  });
  
  return { authorization_url: 'https://checkout.paystack.com/' + paystackRef, reference: paystackRef };
});

exports.paystackWebhook = functions.https.onRequest(async (req, res) => {
  // Verify Paystack signature here in real implementation
  const body = req.body;
  if (body.event === 'charge.success') {
    const reference = body.data.reference;
    const snap = await db.collection('transactions').where('paystackRef', '==', reference).limit(1).get();
    if (!snap.empty) {
      const tx = snap.docs[0];
      await tx.ref.update({
        status: 'completed',
        completedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      // Handle auto-approve enrollment logic here
    }
  }
  res.sendStatus(200);
});

// 3.4 Email Notifications (Trigger Email)
// Simulated by Firestore triggers adding to a mail collection
exports.onStudentApproved = functions.firestore.document('students/{studentId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    // Simulate sending email
    console.log(`Emailing parent/student for new account: ${data.email}`);
  });

// 3.5 Scheduled Cleanup
exports.scheduledCleanup = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
  const now = admin.firestore.Timestamp.now();
  const ninetyDaysAgo = new admin.firestore.Timestamp(now.seconds - (90 * 24 * 60 * 60), 0);
  
  const requestsSnap = await db.collection('student_requests')
    .where('status', '==', 'rejected')
    .where('createdAt', '<', ninetyDaysAgo)
    .get();
    
  const batch = db.batch();
  requestsSnap.forEach(doc => {
    batch.delete(doc.ref);
  });
  await batch.commit();
  console.log(`Cleaned up ${requestsSnap.size} old rejected requests.`);
});


// Phase 2: Rate Limiting
exports.checkLoginRateLimit = functions.https.onCall(async (data, context) => {
  const { email } = data;
  if (!email) return { allowed: false, minutesRemaining: 0 };
  
  const ref = db.collection('loginAttempts').doc(email);
  const doc = await ref.get();
  const now = Date.now();
  
  if (doc.exists) {
    const d = doc.data();
    if (d.lockedUntil && d.lockedUntil > now) {
      return { allowed: false, minutesRemaining: Math.ceil((d.lockedUntil - now) / 60000) };
    }
  }
  return { allowed: true, minutesRemaining: 0 };
});

exports.recordFailedLogin = functions.https.onCall(async (data, context) => {
  const { email } = data;
  if (!email) return;
  
  const ref = db.collection('loginAttempts').doc(email);
  const doc = await ref.get();
  const now = Date.now();
  
  if (doc.exists) {
    let count = doc.data().count || 0;
    count++;
    let lockedUntil = null;
    if (count >= 5) {
      lockedUntil = now + (60 * 60 * 1000); // 1 hour
    }
    await ref.update({ count, lastAttempt: now, lockedUntil });
  } else {
    await ref.set({ count: 1, lastAttempt: now, lockedUntil: null });
  }
});

exports.resetLoginRateLimit = functions.https.onCall(async (data, context) => {
  const { email } = data;
  if (email) {
    await db.collection('loginAttempts').doc(email).delete();
  }
});

// Phase 2: Create Firebase Auth Account for access-code student
exports.createFirebaseAccountForStudent = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Admin only');
  
  // Verify caller is admin
  const callerDoc = await db.collection('users').doc(context.auth.uid).get();
  if (!callerDoc.exists || (callerDoc.data().role !== 'admin' && callerDoc.data().role !== 'schoolAdmin')) {
    throw new functions.https.HttpsError('permission-denied', 'Must be admin');
  }

  const { studentId } = data;
  const studentRef = db.collection('students').doc(studentId);
  const studentDoc = await studentRef.get();
  
  if (!studentDoc.exists) throw new functions.https.HttpsError('not-found', 'Student not found');
  const studentData = studentDoc.data();
  
  if (studentData.authType === 'firebase') {
    return { success: false, message: 'Student already has Firebase Auth.' };
  }

  // Generate random 12-char password
  const tempPassword = Math.random().toString(36).slice(-12);
  
  try {
    const userRecord = await admin.auth().createUser({
      email: studentData.email,
      password: tempPassword,
      displayName: studentData.name || studentData.fullName
    });
    
    await studentRef.update({
      uid: userRecord.uid,
      authType: 'firebase'
    });
    
    await db.collection('users').doc(userRecord.uid).set({
      role: 'student',
      email: studentData.email
    });
    
    // In real app, send email with temp password
    console.log(`Sending email to ${studentData.email} with temp password ${tempPassword}`);
    
    return { success: true, tempPassword, uid: userRecord.uid };
  } catch(error) {
    console.error('Error creating user:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// Phase 4: Create Tutor Auth
exports.createTutorAccount = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Admin only');
  
  const callerDoc = await db.collection('users').doc(context.auth.uid).get();
  if (!callerDoc.exists || callerDoc.data().role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Must be admin');
  }

  const { email, name, applicationId } = data;
  const tempPassword = Math.random().toString(36).slice(-8);
  
  try {
    const userRecord = await admin.auth().createUser({
      email: email,
      password: tempPassword,
      displayName: name
    });
    
    await db.collection('users').doc(userRecord.uid).set({
      role: 'tutor',
      email: email,
      theme: 'dark'
    });
    
    return { success: true, tempPassword, uid: userRecord.uid };
  } catch(error) {
    if (error.code === 'auth/email-already-exists') {
      const user = await admin.auth().getUserByEmail(email);
      await db.collection('users').doc(user.uid).set({
        role: 'tutor',
        email: email,
        theme: 'dark'
      });
      return { success: true, message: 'User already existed, updated role.', uid: user.uid };
    }
    throw new functions.https.HttpsError('internal', error.message);
  }
});

exports.createSchoolAdminAccount = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Admin only');
  
  const callerDoc = await db.collection('users').doc(context.auth.uid).get();
  if (!callerDoc.exists || callerDoc.data().role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Must be admin');
  }

  const { email, name, schoolId } = data;
  const tempPassword = Math.random().toString(36).slice(-12);
  
  try {
    const userRecord = await admin.auth().createUser({
      email: email,
      password: tempPassword,
      displayName: name
    });
    
    await db.collection('users').doc(userRecord.uid).set({
      role: 'schoolAdmin',
      email: email,
      theme: 'dark'
    });
    
    await db.collection('schoolAdmins').doc(userRecord.uid).set({
      uid: userRecord.uid,
      schoolId: schoolId,
      email: email,
      name: name,
      role: 'schoolAdmin',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: context.auth.uid
    });
    
    return { success: true, tempPassword, uid: userRecord.uid };
  } catch(error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});


// Phase 8: System Audit Logging
function createAuditLogger(collectionName) {
  return functions.firestore.document(collectionName + '/{docId}').onWrite(async (change, context) => {
    const docId = context.params.docId;
    let operation = 'UPDATE';
    if (!change.before.exists) {
      operation = 'CREATE';
    } else if (!change.after.exists) {
      operation = 'DELETE';
    }

    const beforeData = change.before.data() || null;
    const afterData = change.after.data() || null;
    
    // We don't have auth context in firestore triggers directly unless we pass the uid in the document.
    // For now, we just record the change.
    await db.collection('audit_logs').add({
      collection: collectionName,
      docId: docId,
      operation: operation,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      before: beforeData,
      after: afterData
    });
  });
}

exports.auditUsers = createAuditLogger('users');
exports.auditStudents = createAuditLogger('students');
exports.auditTransactions = createAuditLogger('transactions');

// Phase 2: Verify Access Code (Secure Login)
exports.verifyAccessCode = functions.https.onCall(async (data, context) => {
  const { username, accessCode } = data;
  if (!username || !accessCode) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing credentials');
  }

  const emailNorm = username.trim().toLowerCase();
  
  let snap = await db.collection('students').where('email', '==', emailNorm).get();
  if (snap.empty) {
    snap = await db.collection('students').where('username', '==', username.trim()).get();
  }
  if (snap.empty) {
    snap = await db.collection('students').where('username', '==', emailNorm).get();
  }
  if (snap.empty) {
    snap = await db.collection('students').where('username', '==', username.trim().toUpperCase()).get();
  }

  if (snap.empty) {
    return { success: false, message: 'Invalid credentials' };
  }

  const d = snap.docs[0];
  const studentData = d.data();

  if (studentData.accessCodeExpiry && studentData.accessCodeExpiry.toDate() < new Date()) {
    return { success: false, message: 'Access code expired' };
  }

  const bcrypt = require('bcryptjs');
  let isValid = false;
  
  if (studentData.accessCodeHash) {
    try {
      isValid = bcrypt.compareSync(accessCode.trim(), studentData.accessCodeHash);
    } catch(e) { console.error('Bcrypt error', e); }
  }
  
  if (!isValid && studentData.accessCode) {
    if (accessCode.trim() === studentData.accessCode) isValid = true;
  }

  if (!isValid) {
    return { success: false, message: 'Invalid credentials' };
  }

  // Create Custom Token
  const customToken = await admin.auth().createCustomToken(d.id, { role: 'student' });
  return { success: true, token: customToken, studentId: d.id, data: studentData };
});

// Phase 2: Verify Access Code (Secure Login)
exports.verifyAccessCode = functions.https.onCall(async (data, context) => {
  const { username, accessCode } = data;
  if (!username || !accessCode) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing credentials');
  }

  const emailNorm = username.trim().toLowerCase();
  
  let snap = await db.collection('students').where('email', '==', emailNorm).get();
  if (snap.empty) {
    snap = await db.collection('students').where('username', '==', username.trim()).get();
  }
  if (snap.empty) {
    snap = await db.collection('students').where('username', '==', emailNorm).get();
  }
  if (snap.empty) {
    snap = await db.collection('students').where('username', '==', username.trim().toUpperCase()).get();
  }

  if (snap.empty) {
    return { success: false, message: 'Invalid credentials' };
  }

  const d = snap.docs[0];
  const studentData = d.data();

  if (studentData.accessCodeExpiry && studentData.accessCodeExpiry.toDate() < new Date()) {
    return { success: false, message: 'Access code expired' };
  }

  const bcrypt = require('bcryptjs'); // Assuming bcryptjs is installed in functions
  let isValid = false;
  
  if (studentData.accessCodeHash) {
    try {
      isValid = bcrypt.compareSync(accessCode.trim(), studentData.accessCodeHash);
    } catch(e) { console.error('Bcrypt error', e); }
  }
  
  if (!isValid && studentData.accessCode) {
    if (accessCode.trim() === studentData.accessCode) isValid = true;
  }

  if (!isValid) {
    return { success: false, message: 'Invalid credentials' };
  }

  // Create Custom Token
  const customToken = await admin.auth().createCustomToken(d.id, { role: 'student' });
  return { success: true, token: customToken, studentId: d.id, data: studentData };
});

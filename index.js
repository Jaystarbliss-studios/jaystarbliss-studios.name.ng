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

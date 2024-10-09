const functions = require('firebase-functions');
const admin = require('firebase-admin');
const stripe = require('stripe');
const cors = require('cors')({origin: true});

admin.initializeApp();

exports.testStripeConnection = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
      if (!req.body || !req.body.userId) {
        throw new functions.https.HttpsError('invalid-argument', 'The function must be called with a userId.');
      }

      const userId = req.body.userId;
      const stripeIntegrationRef = admin.firestore().collection('stripeIntegration').doc(userId);
      const doc = await stripeIntegrationRef.get();

      if (!doc.exists) {
        throw new functions.https.HttpsError('not-found', 'Stripe configuration not found for this user.');
      }

      const { secretKey, isTestMode } = doc.data();
      const stripeInstance = stripe(secretKey);

      await stripeInstance.paymentIntents.create({
        amount: 1000,
        currency: 'brl',
        payment_method_types: ['card'],
      });

      res.json({ success: true });
    } catch (error) {
      console.error('Stripe connection test failed:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  });
});

exports.processStripePayment = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
      const { userId, amount, installments } = req.body;
      const stripeIntegrationRef = admin.firestore().collection('stripeIntegration').doc(userId);
      const doc = await stripeIntegrationRef.get();

      if (!doc.exists) {
        throw new functions.https.HttpsError('not-found', 'Stripe configuration not found for this user.');
      }

      const { secretKey } = doc.data();
      const stripeInstance = stripe(secretKey);

      const paymentIntent = await stripeInstance.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: 'brl',
        payment_method_types: ['card'],
        metadata: { installments },
      });

      res.json({ success: true, clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error('Stripe payment processing failed:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  });
});

exports.processPixPayment = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
      const { userId, amount } = req.body;
      // Implementar lógica para processar pagamento Pix
      // Esta é uma implementação fictícia, você precisará integrar com um provedor de pagamentos que suporte Pix
      res.json({ success: true, pixCode: 'PIX_CODE_HERE' });
    } catch (error) {
      console.error('Pix payment processing failed:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  });
});

exports.stripeWebhook = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    const stripeInstance = stripe(functions.config().stripe.secret_key);
    const sig = req.headers['stripe-signature'];

    try {
      const event = stripeInstance.webhooks.constructEvent(req.rawBody, sig, functions.config().stripe.webhook_secret);

      switch (event.type) {
        case 'payment_intent.succeeded':
          await handleSuccessfulPayment(event.data.object);
          break;
        case 'payment_intent.payment_failed':
          await handleFailedPayment(event.data.object);
          break;
        // Adicione mais casos conforme necessário
      }

      res.json({received: true});
    } catch (err) {
      console.error('Error processing Stripe webhook:', err);
      res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }
  });
});

async function handleSuccessfulPayment(paymentIntent) {
  const userId = paymentIntent.metadata.userId;
  const amount = paymentIntent.amount / 100;

  const userRef = admin.firestore().collection('users').doc(userId);
  await userRef.update({
    balance: admin.firestore.FieldValue.increment(amount)
  });

  await admin.firestore().collection('walletHistory').add({
    userId: userId,
    amount: amount,
    type: 'credit',
    method: 'stripe',
    status: 'completed',
    timestamp: admin.firestore.FieldValue.serverTimestamp()
  });

  // Implementar lógica de notificação (e-mail, push notification, etc.)
}

async function handleFailedPayment(paymentIntent) {
  const userId = paymentIntent.metadata.userId;

  await admin.firestore().collection('walletHistory').add({
    userId: userId,
    amount: paymentIntent.amount / 100,
    type: 'credit',
    method: 'stripe',
    status: 'failed',
    timestamp: admin.firestore.FieldValue.serverTimestamp()
  });

  // Implementar lógica de notificação (e-mail, push notification, etc.)
}
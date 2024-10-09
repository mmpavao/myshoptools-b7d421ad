const functions = require('firebase-functions');
const admin = require('firebase-admin');
const stripe = require('stripe');

admin.initializeApp();

exports.testStripeConnection = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }

  const userId = data.userId;
  const stripeIntegrationRef = admin.firestore().collection('stripeIntegration').doc(userId);
  const doc = await stripeIntegrationRef.get();

  if (!doc.exists) {
    throw new functions.https.HttpsError('not-found', 'Stripe configuration not found for this user.');
  }

  const { secretKey, isTestMode } = doc.data();
  const stripeInstance = stripe(secretKey);

  try {
    await stripeInstance.paymentIntents.create({
      amount: 1000,
      currency: 'brl',
      payment_method_types: ['card'],
    });
    return { success: true };
  } catch (error) {
    console.error('Stripe connection test failed:', error);
    return { success: false, message: error.message };
  }
});

exports.processStripePayment = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }

  const { userId, amount, installments } = data;
  const stripeIntegrationRef = admin.firestore().collection('stripeIntegration').doc(userId);
  const doc = await stripeIntegrationRef.get();

  if (!doc.exists) {
    throw new functions.https.HttpsError('not-found', 'Stripe configuration not found for this user.');
  }

  const { secretKey } = doc.data();
  const stripeInstance = stripe(secretKey);

  try {
    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'brl',
      payment_method_types: ['card'],
      metadata: { installments },
    });

    return { success: true, clientSecret: paymentIntent.client_secret };
  } catch (error) {
    console.error('Stripe payment processing failed:', error);
    return { success: false, message: error.message };
  }
});

exports.processPixPayment = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }

  const { userId, amount } = data;
  // Implementar lógica para processar pagamento Pix
  // Esta é uma implementação fictícia, você precisará integrar com um provedor de pagamentos que suporte Pix
  return { success: true, pixCode: 'PIX_CODE_HERE' };
});

// Webhook para processar eventos do Stripe
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  const stripeInstance = stripe(functions.config().stripe.secret_key);
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripeInstance.webhooks.constructEvent(req.rawBody, sig, functions.config().stripe.webhook_secret);

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        await handleSuccessfulPayment(paymentIntent);
        break;
      case 'payment_intent.payment_failed':
        const failedPaymentIntent = event.data.object;
        await handleFailedPayment(failedPaymentIntent);
        break;
      // Adicione mais casos conforme necessário
    }

    res.json({received: true});
  } catch (err) {
    console.error('Error processing Stripe webhook:', err);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

async function handleSuccessfulPayment(paymentIntent) {
  const userId = paymentIntent.metadata.userId;
  const amount = paymentIntent.amount / 100;

  // Atualizar o saldo do usuário
  const userRef = admin.firestore().collection('users').doc(userId);
  await userRef.update({
    balance: admin.firestore.FieldValue.increment(amount)
  });

  // Adicionar à história de transações
  await admin.firestore().collection('walletHistory').add({
    userId: userId,
    amount: amount,
    type: 'credit',
    method: 'stripe',
    status: 'completed',
    timestamp: admin.firestore.FieldValue.serverTimestamp()
  });

  // Enviar notificação ao usuário
  // Implementar lógica de notificação (e-mail, push notification, etc.)
}

async function handleFailedPayment(paymentIntent) {
  const userId = paymentIntent.metadata.userId;

  // Registrar a falha de pagamento
  await admin.firestore().collection('walletHistory').add({
    userId: userId,
    amount: paymentIntent.amount / 100,
    type: 'credit',
    method: 'stripe',
    status: 'failed',
    timestamp: admin.firestore.FieldValue.serverTimestamp()
  });

  // Notificar o usuário sobre a falha
  // Implementar lógica de notificação (e-mail, push notification, etc.)
}
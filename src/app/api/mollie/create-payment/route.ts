import { NextRequest, NextResponse } from 'next/server';
import { createMollieClient, PaymentMethod } from '@mollie/api-client';

// Initialiser le client Mollie
const mollieClient = createMollieClient({ 
  apiKey: process.env.MOLLIE_API_KEY || 'test_...' 
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, description, redirectUrl, webhookUrl, metadata } = body;

    // Validation des données
    if (!amount || !description) {
      return NextResponse.json(
        { error: 'Amount and description are required' },
        { status: 400 }
      );
    }

    //  Log pour déboguer
    console.log('Données reçues:', { amount, description, redirectUrl, webhookUrl });
    console.log('Montant converti:', (amount / 100).toFixed(2));
    console.log('Méthode de paiement sélectionnée:', metadata?.paymentMethod);
    
          // ✅ Déterminer la méthode de paiement basée sur les métadonnées
      let paymentMethod: PaymentMethod | undefined = undefined;
      if (metadata?.paymentMethod === 'paypal') {
        paymentMethod = PaymentMethod.paypal;
      } else if (metadata?.paymentMethod === 'bancontact') {
        paymentMethod = PaymentMethod.bancontact;
      } else if (metadata?.paymentMethod === 'creditcard') {
        paymentMethod = PaymentMethod.creditcard;
      }

      // Créer le paiement avec Mollie
      const payment = await mollieClient.payments.create({
        amount: {
          currency: 'EUR',
          value: (amount / 100).toFixed(2) // ✅ Mollie attend "12.50" (euros avec 2 décimales)
        },
        description: description,
        redirectUrl: redirectUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
        webhookUrl: 'https://webhook.site/e9b935c7-7a07-4846-b6ce-c37d7b6da0ec', // ✅ Force l'utilisation de webhook.site
        metadata: metadata || {},
        // ✅ Spécifier la méthode de paiement pour avoir le bon comportement
        method: paymentMethod,
        billingEmail: metadata?.customerInfo?.email || 'client@example.com'
      });

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      checkoutUrl: payment.getCheckoutUrl(),
      status: payment.status
    });

  } catch (error) {
    console.error('Erreur lors de la création du paiement Mollie:', error);
    
    // ✅ Retourner plus de détails sur l'erreur
    let errorMessage = 'Erreur lors de la création du paiement';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: errorMessage,
        details: error instanceof Error ? error.stack : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}

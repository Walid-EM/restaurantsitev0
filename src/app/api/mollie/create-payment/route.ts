import { NextRequest, NextResponse } from 'next/server';
import { createMollieClient } from '@mollie/api-client';

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

    // Créer le paiement avec Mollie
    const payment = await mollieClient.payments.create({
      amount: {
        currency: 'EUR',
        value: amount.toFixed(2) // Mollie attend une chaîne avec 2 décimales
      },
      description: description,
      redirectUrl: redirectUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
      webhookUrl: webhookUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/api/mollie/webhook`,
      metadata: metadata || {},
      // Pas de méthode spécifique - laisse Mollie choisir
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
    return NextResponse.json(
      { error: 'Erreur lors de la création du paiement' },
      { status: 500 }
    );
  }
}

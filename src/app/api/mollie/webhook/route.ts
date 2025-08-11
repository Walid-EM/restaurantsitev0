import { NextRequest, NextResponse } from 'next/server';
import { createMollieClient } from '@mollie/api-client';

const mollieClient = createMollieClient({ 
  apiKey: process.env.MOLLIE_API_KEY || 'test_...' 
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Payment ID missing' }, { status: 400 });
    }

    // Récupérer les détails du paiement
    const payment = await mollieClient.payments.get(id);

    // Traiter le statut du paiement
    switch (payment.status) {
      case 'paid':
        // Paiement réussi - mettre à jour la base de données
        console.log(`Paiement ${id} réussi pour ${payment.amount.value} ${payment.amount.currency}`);
        
        // Ici vous pouvez ajouter votre logique métier :
        // - Mettre à jour le statut de la commande
        // - Envoyer un email de confirmation
        // - Créer une facture
        // - etc.
        
        break;
        
      case 'failed':
        // Paiement échoué
        console.log(`Paiement ${id} échoué`);
        break;
        
      case 'canceled':
        // Paiement annulé (orthographe américaine)
        console.log(`Paiement ${id} annulé`);
        break;
        
      case 'expired':
        // Paiement expiré
        console.log(`Paiement ${id} expiré`);
        break;
        
      default:
        console.log(`Statut du paiement ${id}: ${payment.status}`);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Erreur webhook Mollie:', error);
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
  }
}

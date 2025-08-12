import { NextRequest, NextResponse } from 'next/server';
import { createOrder, getOrders } from '@/lib/orders';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validation des données
    if (!body.customerName || !body.customerEmail || !body.items || body.items.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Données manquantes: customerName, customerEmail et items sont requis'
      }, { status: 400 });
    }
    
    const order = await createOrder(body);
    
    return NextResponse.json({
      success: true,
      message: 'Commande créée avec succès',
      order
    }, { status: 201 });
    
  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error);
    return NextResponse.json({
      success: false,
      message: 'Erreur lors de la création de la commande',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const orders = await getOrders();
    
    return NextResponse.json({
      success: true,
      orders,
      count: orders.length
    });
    
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    return NextResponse.json({
      success: false,
      message: 'Erreur lors de la récupération des commandes',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}

import { connectDB } from './mongodb';
import { CartItem } from '@/app/types';

export interface Order {
  _id?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod: string;
  orderDate: Date;
  estimatedDelivery?: Date;
  notes?: string;
}

export async function createOrder(orderData: Omit<Order, '_id' | 'orderDate'>): Promise<Order> {
  try {
    await connectDB();
    const db = (global as any).mongoose.connection.db;
    if (!db) throw new Error('Base de données non connectée');
    
    const ordersCollection = db.collection("orders");
    
    const order: Order = {
      ...orderData,
      orderDate: new Date()
    };
    
    const result = await ordersCollection.insertOne(order);
    
    return {
      ...order,
      _id: result.insertedId.toString()
    };
  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error);
    throw new Error('Impossible de créer la commande');
  }
}

export async function getOrders(): Promise<Order[]> {
  try {
    await connectDB();
    const db = (global as any).mongoose.connection.db;
    if (!db) throw new Error('Base de données non connectée');
    
    const ordersCollection = db.collection("orders");
    
    const orders = await ordersCollection
      .find({})
      .sort({ orderDate: -1 })
      .toArray();
    
    return orders as Order[];
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    throw new Error('Impossible de récupérer les commandes');
  }
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    await connectDB();
    const db = (global as any).mongoose.connection.db;
    if (!db) throw new Error('Base de données non connectée');
    
    const ordersCollection = db.collection("orders");
    
    const order = await ordersCollection.findOne({ _id: orderId });
    return order as Order | null;
  } catch (error) {
    console.error('Erreur lors de la récupération de la commande:', error);
    throw new Error('Impossible de récupérer la commande');
  }
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<boolean> {
  try {
    await connectDB();
    const db = (global as any).mongoose.connection.db;
    if (!db) throw new Error('Base de données non connectée');
    
    const ordersCollection = db.collection("orders");
    
    const result = await ordersCollection.updateOne(
      { _id: orderId },
      { $set: { status } }
    );
    
    return result.modifiedCount > 0;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    throw new Error('Impossible de mettre à jour le statut');
  }
}

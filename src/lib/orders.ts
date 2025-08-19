import { connectDB } from './mongodb';
import { CartItem } from '@/app/types';
import { ObjectId } from 'mongodb';

interface GlobalWithMongoose {
  mongoose?: {
    connection: {
      db: {
        collection: (name: string) => {
          insertOne: (doc: Order) => Promise<{ insertedId: ObjectId }>;
          find: (query: Record<string, unknown>) => {
            sort: (sort: Record<string, 1 | -1>) => {
              toArray: () => Promise<Order[]>;
            };
          };
          findOne: (query: Record<string, unknown>) => Promise<Order | null>;
          updateOne: (query: Record<string, unknown>, update: Record<string, unknown>) => Promise<{ modifiedCount: number }>;
        };
      };
    };
  };
}

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
    const db = (global as GlobalWithMongoose).mongoose?.connection.db;
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
    console.log('🔄 Connexion à MongoDB pour récupérer les commandes...');
    await connectDB();
    
    const db = (global as GlobalWithMongoose).mongoose?.connection.db;
    if (!db) {
      console.log('❌ Base de données non connectée');
      throw new Error('Base de données non connectée');
    }
    
    console.log('✅ Connexion MongoDB établie');
    
    console.log('📊 Tentative de récupération des commandes...');
    const ordersCollection = db.collection("orders");
    
    try {
      const orders = await ordersCollection
        .find({})
        .sort({ orderDate: -1 })
        .toArray();
      
      console.log(`✅ ${orders.length} commandes récupérées avec succès`);
      return orders;
      
    } catch (collectionError) {
      console.log('📝 Erreur lors de l\'accès à la collection orders:', collectionError);
      console.log('📝 Collection orders probablement inexistante, retour d\'un tableau vide');
      return [];
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des commandes:', error);
    
    // Si c'est une erreur de collection inexistante, retourner un tableau vide
    if (error instanceof Error && (
      error.message.includes('collection') || 
      error.message.includes('not found') ||
      error.message.includes('does not exist') ||
      error.message.includes('Namespace not found')
    )) {
      console.log('📝 Collection orders inexistante ou introuvable, retour d\'un tableau vide');
      return [];
    }
    
    throw new Error('Impossible de récupérer les commandes');
  }
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    await connectDB();
    const db = (global as GlobalWithMongoose).mongoose?.connection.db;
    if (!db) throw new Error('Base de données non connectée');
    
    const ordersCollection = db.collection("orders");
    
    const order = await ordersCollection.findOne({ _id: orderId });
    return order;
  } catch (error) {
    console.error('Erreur lors de la récupération de la commande:', error);
    throw new Error('Impossible de récupérer la commande');
  }
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<boolean> {
  try {
    await connectDB();
    const db = (global as GlobalWithMongoose).mongoose?.connection.db;
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

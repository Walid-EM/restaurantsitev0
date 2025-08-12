import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return NextResponse.json({
        success: false,
        error: 'Email, mot de passe et nom sont requis'
      }, { status: 400 });
    }

    await connectDB();

    // Vérifier si un admin existe déjà
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return NextResponse.json({
        success: false,
        error: 'Un administrateur existe déjà'
      }, { status: 400 });
    }

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({
        success: false,
        error: 'Cet email est déjà utilisé'
      }, { status: 400 });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Créer l'utilisateur admin
    const adminUser = new User({
      email,
      password: hashedPassword,
      name,
      role: 'admin'
    });

    await adminUser.save();

    return NextResponse.json({
      success: true,
      message: 'Administrateur créé avec succès',
      user: {
        id: adminUser._id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Erreur lors de la création de l\'admin:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la création de l\'administrateur'
    }, { status: 500 });
  }
}

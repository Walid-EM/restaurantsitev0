import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Category from '@/models/Category';

// Vérifier les permissions admin
async function checkAdminPermissions(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return false;
  }
  return true;
}

// POST - Migrer les options de catégories
export async function POST(request: NextRequest) {
  try {
    if (!(await checkAdminPermissions(request))) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    await connectDB();

    // Mapping par défaut basé sur l'ancien code en dur
    const defaultCategoryOptions: { [key: string]: string[] } = {
      'assiette': ['supplements', 'sauces', 'extras', 'accompagnements', 'boissons'],
      'sandwich': ['supplements', 'sauces', 'extras', 'accompagnements', 'boissons'],
      'tacos': ['supplements', 'sauces', 'extras', 'accompagnements', 'boissons'],
      'bicky': ['supplements', 'sauces', 'extras'],
      'snacks': ['sauces'],
      'dessert': [],
      'boissons': []
    };

    const results = [];
    let updated = 0;
    let skipped = 0;

    // Récupérer toutes les catégories
    const categories = await Category.find({});
    
    for (const category of categories) {
      const categoryName = category.name.toLowerCase();
      
      // Si la catégorie n'a pas encore d'allowedOptions ou si elle est vide
      if (!category.allowedOptions || category.allowedOptions.length === 0) {
        const defaultOptions = defaultCategoryOptions[categoryName] || [];
        
        await Category.findByIdAndUpdate(
          category._id,
          { allowedOptions: defaultOptions },
          { new: true }
        );
        
        results.push({
          category: category.name,
          action: 'updated',
          allowedOptions: defaultOptions
        });
        updated++;
      } else {
        results.push({
          category: category.name,
          action: 'skipped',
          reason: 'allowedOptions already exists',
          currentOptions: category.allowedOptions
        });
        skipped++;
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Migration des options de catégories terminée',
      summary: {
        total: categories.length,
        updated,
        skipped
      },
      details: results
    });

  } catch (error) {
    console.error('Erreur lors de la migration des options de catégories:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la migration des options de catégories',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}


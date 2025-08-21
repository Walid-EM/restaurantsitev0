'use client';

import { Button } from './button';

export default function ButtonTest() {
  return (
    <div className="p-6 space-y-4">
      <h3 className="text-lg font-semibold">Test du Composant Button</h3>
      
      <div className="space-y-2">
        <Button>Bouton Default</Button>
        <Button variant="destructive">Bouton Destructive</Button>
        <Button variant="outline">Bouton Outline</Button>
        <Button variant="secondary">Bouton Secondary</Button>
        <Button variant="ghost">Bouton Ghost</Button>
        <Button variant="link">Bouton Link</Button>
      </div>
      
      <div className="space-y-2">
        <Button size="sm">Bouton Small</Button>
        <Button size="default">Bouton Default</Button>
        <Button size="lg">Bouton Large</Button>
        <Button size="icon">🔍</Button>
      </div>
      
      <div className="space-y-2">
        <Button disabled>Bouton Désactivé</Button>
        <Button className="bg-blue-500 hover:bg-blue-600">Bouton Custom</Button>
      </div>
    </div>
  );
}


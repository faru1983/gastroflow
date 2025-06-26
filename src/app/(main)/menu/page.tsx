
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { products, categories, allergens as allergenData } from '@/lib/data';
import type { Product } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

function AllergenInfo({ allergenIds }: { allergenIds: string[] }) {
    if (allergenIds.length === 0) return null;
    const allergenNames = allergenIds.map(id => allergenData.find(a => a.id === id)?.name).filter(Boolean);
    return <p className="text-xs text-muted-foreground mt-1">Contiene: {allergenNames.join(', ')}</p>;
}

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.categoryId === selectedCategory);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-headline">Nuestra Carta</h1>
        <p className="text-muted-foreground">Explora nuestros sabores únicos</p>
      </header>

      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm py-4 mb-6">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-[280px] mx-auto">
            <SelectValue placeholder="Filtrar por categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-12">
        {(selectedCategory === 'all' ? categories : categories.filter(c => c.id === selectedCategory)).map(category => (
            <section key={category.id}>
                 <h2 className="text-2xl font-headline mb-4">{category.name}</h2>
                 <Separator className="mb-6"/>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {products.filter(p => p.categoryId === category.id).map((product) => (
                    <Card
                    key={product.id}
                    className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow flex md:flex-col md:h-full"
                    onClick={() => setSelectedProduct(product)}
                    >
                        <div className="relative h-28 w-28 md:h-48 md:w-full flex-shrink-0">
                            <Image
                            src={product.image}
                            alt={product.name}
                            layout="fill"
                            objectFit="cover"
                            data-ai-hint={product['data-ai-hint']}
                            />
                        </div>
                        <CardContent className="p-3 md:p-4 flex-grow flex flex-col justify-center">
                            <div className="flex justify-between items-start gap-2">
                                <h3 className="font-semibold text-base md:text-lg leading-tight">{product.name}</h3>
                                <div className="text-right flex-shrink-0">
                                    {product.offerPrice ? (
                                        <>
                                        <p className="text-primary font-bold text-base md:text-lg">${product.offerPrice.toLocaleString('es-CL')}</p>
                                        <p className="text-muted-foreground line-through text-xs md:text-sm">${product.price.toLocaleString('es-CL')}</p>
                                        </>
                                    ) : (
                                        <p className="font-bold text-base md:text-lg text-foreground">${product.price.toLocaleString('es-CL')}</p>
                                    )}
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2 md:line-clamp-none">{product.description}</p>
                            <AllergenInfo allergenIds={product.allergens} />
                        </CardContent>
                    </Card>
                ))}
                </div>
            </section>
        ))}
        </div>


      {selectedProduct && (
        <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
                <div className="relative h-64 w-full mb-4 rounded-lg overflow-hidden">
                    <Image
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        layout="fill"
                        objectFit="cover"
                        data-ai-hint={selectedProduct['data-ai-hint']}
                    />
                </div>
              <DialogTitle className="text-2xl font-headline">{selectedProduct.name}</DialogTitle>
              <DialogDescription className="text-base">
                {selectedProduct.description}
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-between items-center mt-4">
                <AllergenInfo allergenIds={selectedProduct.allergens} />
                <div className="text-right">
                    {selectedProduct.offerPrice ? (
                        <>
                        <p className="text-primary font-bold text-2xl">${selectedProduct.offerPrice.toLocaleString('es-CL')}</p>
                        <p className="text-muted-foreground line-through text-md">${selectedProduct.price.toLocaleString('es-CL')}</p>
                        </>
                    ) : (
                        <p className="font-bold text-2xl text-foreground">${selectedProduct.price.toLocaleString('es-CL')}</p>
                    )}
                </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

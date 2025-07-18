
"use client";

import { useState, useRef } from 'react';
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Star } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from './ui/button';
import { GoogleIcon } from './icons/GoogleIcon';

type Review = {
    text: string;
    author: string;
};

interface CustomerReviewsSectionProps {
    reviews: Review[];
}

const GOOGLE_RATING = 4.8;
const REVIEW_COUNT = 182;

const HalfStarIcon = () => (
  <div className="relative inline-block h-5 w-5">
    <Star className="h-5 w-5 text-yellow-500" />
    <div className="absolute top-0 left-0 h-full w-1/2 overflow-hidden">
      <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
    </div>
  </div>
);

const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<Star key={`star-full-${i}`} className="w-5 h-5 text-yellow-500 fill-yellow-500" />);
      } else if (i - 0.5 <= rating) {
        stars.push(<HalfStarIcon key={`star-half-${i}`} />);
      } else {
        stars.push(<Star key={`star-empty-${i}`} className="w-5 h-5 text-yellow-500" />);
      }
    }
    return stars;
  };

export function CustomerReviewsSection({ reviews }: CustomerReviewsSectionProps) {
    const [isReviewModalOpen, setReviewModalOpen] = useState(false);
    const plugin = useRef(
        Autoplay({ delay: 6000, stopOnInteraction: true })
    );

    return (
        <div className="flex flex-col space-y-4 h-full">
             <Card>
                <CardContent className="p-4 flex items-center justify-center">
                     <div 
                        className="flex items-center justify-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer"
                        onClick={() => setReviewModalOpen(true)}
                    >
                        <GoogleIcon className="w-7 h-7"/>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <p className="text-2xl font-bold">{GOOGLE_RATING}</p>
                                <div className="flex">{renderStars(GOOGLE_RATING)}</div>
                            </div>
                            <p className="text-xs text-muted-foreground -mt-1 underline">{REVIEW_COUNT} reseñas</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card className="flex-grow flex flex-col">
                <CardHeader className="pb-2">
                    <CardTitle className="font-headline text-2xl">¿Qué dicen nuestros clientes?</CardTitle>
                </CardHeader>
                <CardContent className="relative flex-grow flex items-center p-6 pt-2">
                    <Carousel 
                        className="w-full" 
                        opts={{ loop: true }}
                        plugins={[plugin.current]}
                        onMouseEnter={() => plugin.current.stop()}
                        onMouseLeave={() => plugin.current.reset()}
                    >
                        <CarouselContent>
                            {reviews.map((review, index) => (
                            <CarouselItem key={index}>
                                <div className="p-1 text-center min-h-[12rem] flex flex-col justify-center items-center px-10">
                                    <p className="text-muted-foreground italic mb-4">&quot;{review.text}&quot;</p>

                                    <p className="font-semibold">{review.author}</p>
                                </div>
                            </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="absolute -left-2 top-[70%] -translate-y-1/2" />
                        <CarouselNext className="absolute -right-2 top-[70%] -translate-y-1/2" />
                    </Carousel>
                </CardContent>
            </Card>

            <Dialog open={isReviewModalOpen} onOpenChange={setReviewModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="font-headline text-2xl">¡Valora tu experiencia!</DialogTitle>
                        <DialogDescription>
                            Tu opinión nos ayuda a mejorar. Déjanos una reseña en Google Maps.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                         <Button asChild className="w-full">
                            <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer">
                                Dejar una Reseña
                            </a>
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

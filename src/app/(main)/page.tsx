import Image from 'next/image';
import Link from 'next/link';
import { summarizeReviews } from '@/ai/flows/summarize-reviews';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Footer } from '@/components/Footer';
import { Star, Mail, Phone, MapPin, Facebook, Instagram } from 'lucide-react';
import { TiktokIcon } from '@/components/icons/TiktokIcon';
import { WhatsappIcon } from '@/components/icons/WhatsappIcon';

const MOCK_REVIEWS = `
Review 1: The food was absolutely amazing, best pasta I've had in years! The service was a bit slow, but the atmosphere made up for it.
Review 2: A fantastic place for a date night. Cozy ambiance and delicious desserts. The tiramisu is a must-try. Will definitely be back.
Review 3: Great experience! The staff was incredibly friendly and attentive. The steak was cooked to perfection. Highly recommend for any occasion.
Review 4: Good food, but a little overpriced for the portion size. The location is convenient though.
Review 5: Loved the vibrant energy of this restaurant. The cocktails were creative and tasty. It's a popular spot, so make sure to book in advance.
`;

const MOCK_SUMMARY = "The food is amazing, with a fantastic atmosphere and friendly staff. The pasta and steak come highly recommended, and the desserts are a must-try!";

export default async function HomePage() {
  let summary = MOCK_SUMMARY;

  if (process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY) {
    try {
      const result = await summarizeReviews({ reviewText: MOCK_REVIEWS });
      summary = result.summary;
    } catch (error) {
      console.error("Error fetching review summary:", error);
      // Fallback to mock summary on error
    }
  } else {
    console.log("AI functionality is disabled. Set GOOGLE_API_KEY or GEMINI_API_KEY to enable it.");
  }

  return (
    <div className="w-full">
      <header className="relative h-64 md:h-80">
        <Image
          src="https://placehold.co/1200x400.png"
          alt="Banner del restaurante"
          layout="fill"
          objectFit="cover"
          className="brightness-75"
          data-ai-hint="restaurant interior"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4 bg-black/30">
          <Image src="https://placehold.co/100x100.png" alt="Logotipo" width={100} height={100} className="rounded-full mb-4 border-2 border-white" data-ai-hint="restaurant logo" />
          <h1 className="text-4xl md:text-5xl font-headline font-bold">Nombre del Restaurante</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <section className="text-center">
          <p className="text-lg text-foreground/80">
            Una breve y atractiva descripción del restaurante, su concepto culinario y el ambiente que ofrece a sus comensales.
          </p>
        </section>

        <section className="my-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/menu" passHref><Button size="lg" className="w-full py-8 text-lg" variant="outline">Nuestra Carta</Button></Link>
                <Link href="/reservations" passHref><Button size="lg" className="w-full py-8 text-lg">Reservar Mesa</Button></Link>
                <Link href="/loyalty" passHref><Button size="lg" className="w-full py-8 text-lg" variant="secondary">Fidelización</Button></Link>
            </div>
        </section>

        <Separator className="my-8" />
        
        <section className="grid md:grid-cols-2 gap-8 items-start">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">¿Qué dicen nuestros clientes?</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground italic mb-4">&quot;{summary}&quot;</p>
                    <a href="#" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary font-semibold hover:underline">
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        <span>Ver más y dejar una reseña en Google</span>
                    </a>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Información de Contacto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <p className="flex items-center gap-3"><MapPin className="w-5 h-5 text-primary"/> <span>Av. Ejemplo 123, Providencia, Santiago</span></p>
                    <p className="flex items-center gap-3"><Phone className="w-5 h-5 text-primary"/> <span>+56 2 1234 5678</span></p>
                    <p className="font-semibold mt-2">Horario:</p>
                    <p className="text-muted-foreground ml-8">Lunes a Sábado: 12:00 - 23:00</p>
                    <p className="text-muted-foreground ml-8">Domingo: 12:00 - 18:00</p>
                </CardContent>
            </Card>
        </section>

        <Separator className="my-8" />

        <section className="text-center">
            <h3 className="text-2xl font-headline mb-4">Síguenos</h3>
            <div className="flex justify-center items-center gap-6">
                <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><Facebook size={28}/></a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><Instagram size={28}/></a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><TiktokIcon className="w-7 h-7"/></a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><WhatsappIcon className="w-7 h-7"/></a>
                <a href="mailto:contacto@restaurante.com" className="text-muted-foreground hover:text-primary"><Mail size={28}/></a>
            </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}

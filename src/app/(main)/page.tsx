import Image from 'next/image';
import Link from 'next/link';
import { summarizeReviews } from '@/ai/flows/summarize-reviews';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Phone, MapPin, BookOpenText, CalendarClock, Heart } from 'lucide-react';
import { TiktokIcon } from '@/components/icons/TiktokIcon';
import { WhatsappIcon } from '@/components/icons/WhatsappIcon';
import { FacebookIcon } from '@/components/icons/FacebookIcon';
import { InstagramIcon } from '@/components/icons/InstagramIcon';
import { EmailIcon } from '@/components/icons/EmailIcon';
import { CustomerReviewsSection } from '@/components/CustomerReviewsSection';

const MOCK_REVIEWS = `
Review 1: The food was absolutely amazing, best pasta I've had in years! The service was a bit slow, but the atmosphere made up for it.
Review 2: A fantastic place for a date night. Cozy ambiance and delicious desserts. The tiramisu is a must-try. Will definitely be back.
Review 3: Great experience! The staff was incredibly friendly and attentive. The steak was cooked to perfection. Highly recommend for any occasion.
Review 4: Good food, but a little overpriced for the portion size. The location is convenient though.
Review 5: Loved the vibrant energy of this restaurant. The cocktails were creative and tasty. It's a popular spot, so make sure to book in advance.
`;

const customerReviews = [
    {
        text: "La comida es increíble, con un ambiente fantástico y un personal amable. La pasta y el filete son muy recomendables, ¡y los postres son imprescindibles!",
        author: "Ana P.",
        rating: 5
    },
    {
        text: "Un lugar fantástico para una cita nocturna. Ambiente acogedor y postres deliciosos. El tiramisú es algo que deben probar. Definitivamente volveremos.",
        author: "Carlos G.",
        rating: 5
    },
    {
        text: "¡Gran experiencia! El personal fue increíblemente amable y atento. El bistec estaba cocinado a la perfección. Muy recomendable para cualquier ocasión.",
        author: "Sofía L.",
        rating: 4
    }
];

export default async function HomePage() {
  const { summary } = await summarizeReviews({ reviewText: MOCK_REVIEWS }).catch(
    (e) => {
      // The API call will fail if the GEMINI_API_KEY is not set.
      // We'll just use a mock summary in that case.
      return { summary: 'La comida es increíble, con un ambiente fantástico y un personal amable. La pasta y el filete son muy recomendables, ¡y los postres son imprescindibles!' };
    }
  );

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
          <h1 className="text-4xl md:text-5xl font-headline font-bold">GastroFlow</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <section className="text-center">
          <p className="text-lg text-foreground/80">
            {summary}
          </p>
          <p className="mt-2 text-lg text-foreground/80">
             En GastroFlow, cada plato es una obra de arte, preparada con ingredientes frescos y una pasión que se siente en cada bocado. Sumérgete en una atmósfera acogedora y déjate llevar por sabores que cuentan una historia. ¡Te esperamos para crear momentos inolvidables!
          </p>
        </section>

        <section className="my-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/menu" passHref><Button size="lg" className="w-full py-8 text-lg"><BookOpenText/>Nuestra Carta</Button></Link>
                <Link href="/reservations" passHref><Button size="lg" className="w-full py-8 text-lg"><CalendarClock/>Reservar Mesa</Button></Link>
                <Link href="/loyalty" passHref><Button size="lg" className="w-full py-8 text-lg"><Heart/>Registrar Visita</Button></Link>
            </div>
        </section>

        <Separator className="my-8" />
        
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            <CustomerReviewsSection reviews={customerReviews} />

            <Card className="h-full flex flex-col">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Información de Contacto</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-center">
                    <div className="space-y-3">
                        <p className="flex items-center gap-3"><MapPin className="w-5 h-5 text-primary"/> <span>Av. Ejemplo 123, Providencia, Santiago</span></p>
                        <p className="flex items-center gap-3"><Phone className="w-5 h-5 text-primary"/> <span>+56 2 1234 5678</span></p>
                        <p className="font-semibold mt-2">Horario:</p>
                        <p className="text-muted-foreground ml-8">Lunes a Sábado: 12:00 - 23:00</p>
                        <p className="text-muted-foreground ml-8">Domingo: 12:00 - 18:00</p>
                    </div>
                </CardContent>
            </Card>
        </section>

        <Separator className="my-8" />

        <section>
          <h3 className="text-2xl font-headline mb-4 text-center">Encuéntranos</h3>
          <div className="mt-4">
              <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.589993322586!2d-70.6083204847953!3d-33.41165298077868!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662cf66a2c213e5%3A0x86743e435948332a!2sCostanera%20Center!5e0!3m2!1sen!2scl!4v1620926011198!5m2!1sen!2scl" 
                  className="w-full h-64 border-0 rounded-md"
                  allowFullScreen={false} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade">
              </iframe>
          </div>
        </section>

        <Separator className="my-8" />

        <section className="text-center">
            <h3 className="text-2xl font-headline mb-4">Síguenos</h3>
            <div className="flex justify-center items-center gap-6 flex-wrap">
                <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><FacebookIcon className="w-7 h-7"/></a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><InstagramIcon className="w-7 h-7"/></a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><TiktokIcon className="w-7 h-7"/></a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><WhatsappIcon className="w-7 h-7"/></a>
                <a href="mailto:contacto@restaurante.com" className="text-muted-foreground hover:text-primary"><EmailIcon className="w-7 h-7"/></a>
            </div>
        </section>
      </div>
    </div>
  );
}

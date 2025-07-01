
"use client";

import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface LoggedOutCardProps {
    title: string;
    description: string;
    extraContent?: React.ReactNode;
}

export function LoggedOutCard({ title, description, extraContent }: LoggedOutCardProps) {
    const { showAuthModal } = useAuth();
    
    return (
        <Card className="text-center">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">{title}</CardTitle>
                <CardDescription className="text-lg">{description}</CardDescription>
            </CardHeader>
            {extraContent && (
                <CardContent className="space-y-4">
                    {extraContent}
                </CardContent>
            )}
            <CardFooter>
                <Button onClick={() => showAuthModal()} className="w-full">
                    Iniciar Sesión / Registrarse
                </Button>
            </CardFooter>
        </Card>
    );
}

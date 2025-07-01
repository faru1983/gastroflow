
"use client";

import { Button } from "@/components/ui/button";

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    nextPage: () => void;
    prevPage: () => void;
    canNextPage: boolean;
    canPrevPage: boolean;
}

export function PaginationControls({ currentPage, totalPages, nextPage, prevPage, canNextPage, canPrevPage }: PaginationControlsProps) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center items-center gap-4 mt-4">
            <Button onClick={prevPage} disabled={!canPrevPage} variant="outline">Anterior</Button>
            <span className="text-sm text-muted-foreground">Página {currentPage} de {totalPages}</span>
            <Button onClick={nextPage} disabled={!canNextPage} variant="outline">Siguiente</Button>
        </div>
    );
}

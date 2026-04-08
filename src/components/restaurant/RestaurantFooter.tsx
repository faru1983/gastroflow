import { UtensilsCrossed } from "lucide-react";

export default function RestaurantFooter() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://gastroflow.cl";

  return (
    <footer className="py-12 pb-32 text-center opacity-40 hover:opacity-100 transition-opacity">
      <a 
        href={appUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex flex-col items-center gap-2 group"
      >
        <p className="text-[10px] text-outline uppercase tracking-[0.2em] group-hover:text-primary transition-colors">
          Powered by
        </p>
        <div className="flex items-center justify-center gap-1.5 grayscale group-hover:grayscale-0 transition-all">
          <div className="w-5 h-5 rounded-[4px] gradient-primary flex items-center justify-center">
            <UtensilsCrossed size={12} className="text-on-primary-container" />
          </div>
          <span className="text-sm font-bold tracking-tight text-on-surface">
            Gastroflow
          </span>
        </div>
      </a>
    </footer>
  );
}

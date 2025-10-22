import { useState } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface HeaderProps {
  onAdminClick: () => void;
  currentPage: 'home' | 'news';
  onPageChange: (page: 'home' | 'news') => void;
}

export const Header = ({ onAdminClick, currentPage, onPageChange }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home' as const, label: 'Главная', icon: 'Home' },
    { id: 'news' as const, label: 'Новости', icon: 'Newspaper' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Newspaper" className="text-primary" size={32} />
            <h1 className="text-2xl font-heading font-bold">SubiSoftCND</h1>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                  currentPage === item.id ? 'text-primary' : 'text-foreground'
                }`}
              >
                <Icon name={item.icon as any} size={18} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Button onClick={onAdminClick} variant="default" className="hidden md:flex items-center gap-2">
              <Icon name="Settings" size={18} />
              Админ-панель
            </Button>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Icon name="Menu" size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <nav className="flex flex-col gap-4 mt-8">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onPageChange(item.id);
                        setIsOpen(false);
                      }}
                      className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary p-2 rounded ${
                        currentPage === item.id ? 'text-primary bg-primary/10' : 'text-foreground'
                      }`}
                    >
                      <Icon name={item.icon as any} size={18} />
                      {item.label}
                    </button>
                  ))}
                  <Button onClick={() => { onAdminClick(); setIsOpen(false); }} variant="default" className="w-full justify-start gap-2">
                    <Icon name="Settings" size={18} />
                    Админ-панель
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

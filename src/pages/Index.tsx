import { useState } from "react";
import { Header } from "@/components/Header";
import { NewsCard } from "@/components/NewsCard";
import { AdminPanel } from "@/components/AdminPanel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";

const Index = () => {
  const [adminOpen, setAdminOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'news'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const [newsList, setNewsList] = useState([
    {
      id: 1,
      title: "Запуск новой платформы для разработчиков SubiSoft",
      excerpt: "Компания SubiSoftCND представила инновационную платформу для совместной разработки программного обеспечения с использованием AI-технологий.",
      category: "Технологии",
      image: "https://cdn.poehali.dev/projects/f0c33c4e-d9a0-48eb-9401-b678ca35c760/files/3dfa5bad-906b-49f7-96d5-378805cf2ac7.jpg",
      date: new Date().toLocaleDateString('ru-RU'),
      author: "Александр Петров"
    },
    {
      id: 2,
      title: "SubiSoftCND расширяет команду: открыто 50 вакансий",
      excerpt: "В связи с активным ростом компании и запуском новых проектов, SubiSoftCND объявляет о наборе специалистов различных направлений.",
      category: "Бизнес",
      image: "https://cdn.poehali.dev/projects/f0c33c4e-d9a0-48eb-9401-b678ca35c760/files/fda54e2c-c03f-47da-be34-97ac141e9d15.jpg",
      date: new Date().toLocaleDateString('ru-RU'),
      author: "Мария Соколова"
    },
    {
      id: 3,
      title: "Итоги года: ключевые достижения SubiSoftCND",
      excerpt: "Подводим итоги успешного года работы компании. Реализовано более 100 проектов, привлечено инвестиций на $50 млн.",
      category: "Бизнес",
      image: "https://cdn.poehali.dev/projects/f0c33c4e-d9a0-48eb-9401-b678ca35c760/files/15b40b72-38d1-4e4f-bbc7-51eeff939a7c.jpg",
      date: new Date().toLocaleDateString('ru-RU'),
      author: "Дмитрий Иванов"
    },
  ]);

  const categories = ["Все", "Технологии", "Бизнес", "Политика", "Спорт", "Культура", "Наука"];

  const filteredNews = selectedCategory && selectedCategory !== "Все"
    ? newsList.filter(news => news.category === selectedCategory)
    : newsList;

  const handleAddNews = (news: any) => {
    setNewsList([news, ...newsList]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onAdminClick={() => setAdminOpen(true)} 
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      {currentPage === 'home' && (
        <main className="container mx-auto px-4 py-8">
          <div className="mb-12 animate-fade-in">
            <div className="relative h-[400px] rounded-lg overflow-hidden mb-8">
              <img 
                src="https://cdn.poehali.dev/projects/f0c33c4e-d9a0-48eb-9401-b678ca35c760/files/3dfa5bad-906b-49f7-96d5-378805cf2ac7.jpg"
                alt="Hero"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex items-center">
                <div className="container mx-auto px-4">
                  <Badge className="mb-4 bg-primary text-primary-foreground">
                    Главная новость
                  </Badge>
                  <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4 max-w-3xl">
                    Добро пожаловать в SubiSoftCND
                  </h1>
                  <p className="text-lg text-white/90 max-w-2xl mb-6">
                    Ваш источник актуальных новостей из мира технологий, бизнеса и инноваций
                  </p>
                  <Button size="lg" onClick={() => setCurrentPage('news')}>
                    Все новости
                    <Icon name="ArrowRight" size={18} className="ml-2" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Icon name="Users" size={24} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-heading font-semibold">50+</h3>
                </div>
                <p className="text-muted-foreground">Профессионалов в команде</p>
              </div>

              <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Icon name="FileText" size={24} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-heading font-semibold">100+</h3>
                </div>
                <p className="text-muted-foreground">Реализованных проектов</p>
              </div>

              <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Icon name="Award" size={24} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-heading font-semibold">15</h3>
                </div>
                <p className="text-muted-foreground">Наград и сертификатов</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-heading font-bold mb-6">Последние новости</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsList.slice(0, 3).map((news) => (
                <NewsCard key={news.id} {...news} />
              ))}
            </div>
          </div>
        </main>
      )}

      {currentPage === 'news' && (
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl font-heading font-bold mb-4">Все новости</h1>
            <p className="text-muted-foreground mb-6">
              Актуальные новости и события от команды SubiSoftCND
            </p>

            <div className="flex gap-2 overflow-x-auto pb-4">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category || (!selectedCategory && category === "Все") ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category === "Все" ? null : category)}
                  className="whitespace-nowrap"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.length > 0 ? (
              filteredNews.map((news) => (
                <NewsCard key={news.id} {...news} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Icon name="Search" size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Новостей в этой категории пока нет</p>
              </div>
            )}
          </div>
        </main>
      )}

      <footer className="border-t mt-16 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Icon name="Newspaper" className="text-primary" size={24} />
              <span className="font-heading font-bold">SubiSoftCND</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 SubiSoftCND. Все права защищены.
            </p>
          </div>
        </div>
      </footer>

      <AdminPanel 
        open={adminOpen} 
        onOpenChange={setAdminOpen}
        onAddNews={handleAddNews}
      />
    </div>
  );
};

export default Index;

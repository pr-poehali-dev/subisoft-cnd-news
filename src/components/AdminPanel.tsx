import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";
import { useToast } from "@/hooks/use-toast";

interface AdminPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddNews: (news: any) => void;
}

export const AdminPanel = ({ open, onOpenChange, onAddNews }: AdminPanelProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    category: "",
    image: "",
    author: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newNews = {
      id: Date.now(),
      ...formData,
      date: new Date().toLocaleDateString('ru-RU'),
    };
    onAddNews(newNews);
    toast({
      title: "Новость опубликована",
      description: "Новость успешно добавлена на портал",
    });
    setFormData({ title: "", excerpt: "", category: "", image: "", author: "" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-heading">
            <Icon name="Settings" size={24} />
            Админ-панель SubiSoftCND
          </DialogTitle>
          <DialogDescription>
            Управление новостным порталом. Добавляйте и редактируйте новости.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="add" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="add" className="gap-2">
              <Icon name="Plus" size={16} />
              Добавить новость
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Icon name="Users" size={16} />
              Управление ролями
            </TabsTrigger>
          </TabsList>

          <TabsContent value="add" className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Заголовок</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Введите заголовок новости"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Краткое описание</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Краткое описание новости"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Категория</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Технологии">Технологии</SelectItem>
                      <SelectItem value="Бизнес">Бизнес</SelectItem>
                      <SelectItem value="Политика">Политика</SelectItem>
                      <SelectItem value="Спорт">Спорт</SelectItem>
                      <SelectItem value="Культура">Культура</SelectItem>
                      <SelectItem value="Наука">Наука</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author">Автор</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Имя автора"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">URL изображения</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>

              <Button type="submit" className="w-full gap-2">
                <Icon name="Send" size={18} />
                Опубликовать новость
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-heading font-semibold mb-2 flex items-center gap-2">
                  <Icon name="Shield" size={18} />
                  Роли пользователей
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Управление правами доступа для администраторов, создателей и сотрудников
                </p>
                <div className="space-y-2">
                  {['Администратор', 'Создатель проекта', 'Сотрудник'].map((role) => (
                    <div key={role} className="flex items-center justify-between p-3 bg-secondary rounded">
                      <span className="font-medium">{role}</span>
                      <Button variant="outline" size="sm">
                        Настроить
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

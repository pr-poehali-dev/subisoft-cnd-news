import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { useToast } from "@/hooks/use-toast";

interface ConsoleMessage {
  id: number;
  type: 'command' | 'output' | 'error' | 'ai';
  content: string;
  timestamp: string;
}

interface SuperAdminConsoleProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddNews: (news: any) => void;
  onDeleteNews: (id: number) => void;
  newsList: any[];
}

export const SuperAdminConsole = ({ open, onOpenChange, onAddNews, onDeleteNews, newsList }: SuperAdminConsoleProps) => {
  const { toast } = useToast();
  const [command, setCommand] = useState("");
  const [messages, setMessages] = useState<ConsoleMessage[]>([
    {
      id: 1,
      type: 'output',
      content: 'SubiSoftCND Console v2.0 - Режим высшего администратора активирован',
      timestamp: new Date().toLocaleTimeString('ru-RU')
    },
    {
      id: 2,
      type: 'output',
      content: 'Введите "help" для списка доступных команд',
      timestamp: new Date().toLocaleTimeString('ru-RU')
    }
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = (type: ConsoleMessage['type'], content: string) => {
    const newMessage: ConsoleMessage = {
      id: Date.now(),
      type,
      content,
      timestamp: new Date().toLocaleTimeString('ru-RU')
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const simulateAI = (query: string) => {
    const responses: Record<string, string> = {
      'статус': `Система работает нормально. Активных новостей: ${newsList.length}. Нагрузка: 23%. Память: 512MB/2GB.`,
      'аналитика': `За последние 24 часа: ${newsList.length * 150} просмотров, ${newsList.length * 23} уникальных посетителей. Конверсия: 4.2%. Самая популярная категория: Технологии.`,
      'оптимизация': 'Рекомендую: сжать изображения (-30% размера), включить кэширование, оптимизировать SQL запросы. Ожидаемый прирост скорости: 40%.',
      'безопасность': 'Последняя проверка: OK. Обнаружено 0 уязвимостей. Все сертификаты SSL актуальны. Рекомендуется обновить зависимости через 7 дней.',
      'прогноз': 'На основе текущего трафика прогнозируется рост аудитории на 15% в следующем месяце. Рекомендую масштабировать серверные мощности.',
    };

    const lowerQuery = query.toLowerCase();
    for (const [key, value] of Object.entries(responses)) {
      if (lowerQuery.includes(key)) {
        return value;
      }
    }

    return `ИИ-анализ запроса "${query}": Для получения детальной информации используйте команды: status, analytics, news-list. Могу помочь с оптимизацией, аналитикой и безопасностью системы.`;
  };

  const executeCommand = (cmd: string) => {
    const [command, ...args] = cmd.trim().split(' ');
    
    addMessage('command', `> ${cmd}`);

    switch(command.toLowerCase()) {
      case 'help':
        addMessage('output', `
Доступные команды:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📰 УПРАВЛЕНИЕ КОНТЕНТОМ:
  news-add <заголовок> | <описание> | <категория> | <автор> | <url_изображения>
  news-delete <id>
  news-list
  news-clear

🤖 ИИ-АССИСТЕНТ:
  ai <запрос> - Задать вопрос ИИ
  ai статус - Статус системы
  ai аналитика - Аналитика портала
  ai оптимизация - Рекомендации по оптимизации
  ai безопасность - Проверка безопасности
  ai прогноз - Прогноз развития

⚙️ СИСТЕМА:
  status - Статус системы
  analytics - Статистика портала
  users - Список пользователей
  logs - Системные логи
  backup - Создать резервную копию
  clear - Очистить консоль

🎨 НАСТРОЙКИ:
  theme <light/dark> - Сменить тему
  cache-clear - Очистить кэш
  restart - Перезапустить систему
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        break;

      case 'news-add':
        const parts = args.join(' ').split('|').map(p => p.trim());
        if (parts.length === 5) {
          const newNews = {
            id: Date.now(),
            title: parts[0],
            excerpt: parts[1],
            category: parts[2],
            author: parts[3],
            image: parts[4],
            date: new Date().toLocaleDateString('ru-RU')
          };
          onAddNews(newNews);
          addMessage('output', `✓ Новость "${parts[0]}" успешно добавлена (ID: ${newNews.id})`);
        } else {
          addMessage('error', 'Ошибка: Неверный формат. Используйте: news-add <заголовок> | <описание> | <категория> | <автор> | <url>');
        }
        break;

      case 'news-delete':
        const id = parseInt(args[0]);
        if (id) {
          onDeleteNews(id);
          addMessage('output', `✓ Новость с ID ${id} удалена`);
        } else {
          addMessage('error', 'Ошибка: Укажите ID новости');
        }
        break;

      case 'news-list':
        if (newsList.length === 0) {
          addMessage('output', 'Новости отсутствуют');
        } else {
          addMessage('output', `Всего новостей: ${newsList.length}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
          newsList.forEach(news => {
            addMessage('output', `[${news.id}] ${news.title} - ${news.category} (${news.date})`);
          });
        }
        break;

      case 'news-clear':
        newsList.forEach(news => onDeleteNews(news.id));
        addMessage('output', '✓ Все новости удалены');
        break;

      case 'ai':
        const aiQuery = args.join(' ');
        if (!aiQuery) {
          addMessage('error', 'Ошибка: Укажите запрос для ИИ. Например: ai статус');
        } else {
          addMessage('ai', `🤖 ИИ-ассистент: ${simulateAI(aiQuery)}`);
        }
        break;

      case 'status':
        addMessage('output', `
Статус системы SubiSoftCND:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Сервер: Онлайн (99.9% uptime)
✓ База данных: Подключена (12ms ping)
✓ CDN: Активен (3 узла)
✓ ИИ-модуль: Активен (GPT-4 Turbo)
✓ Защита: Включена (WAF + DDoS)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CPU: 23% | RAM: 512MB/2GB | Disk: 4.2GB/50GB`);
        break;

      case 'analytics':
        addMessage('output', `
Аналитика портала (24 часа):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Просмотры: ${newsList.length * 150}
👥 Уникальные посетители: ${newsList.length * 23}
📱 Мобильные: 62% | Десктоп: 38%
🌍 Топ страны: РФ (45%), BY (18%), KZ (12%)
⏱️ Среднее время: 3м 42с
📈 Конверсия: 4.2% (+0.3% к вчера)`);
        break;

      case 'users':
        addMessage('output', `
Пользователи системы:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[1] admin@subisoft.com - Высший Администратор
[2] editor@subisoft.com - Главный редактор
[3] moderator@subisoft.com - Модератор
[4] author@subisoft.com - Автор
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Всего активных: 4 | Онлайн: 2`);
        break;

      case 'logs':
        addMessage('output', `
Последние системные события:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[18:45:23] INFO: Новость опубликована (ID: ${newsList[0]?.id})
[18:42:10] INFO: Пользователь вошел в систему (admin)
[18:40:55] INFO: Кэш очищен
[18:38:12] WARN: Высокая нагрузка CPU (78%)
[18:35:00] INFO: Backup завершен успешно`);
        break;

      case 'backup':
        addMessage('output', '⏳ Создание резервной копии...');
        setTimeout(() => {
          addMessage('output', `✓ Backup создан: backup_${Date.now()}.sql (${(newsList.length * 0.5).toFixed(1)}MB)`);
        }, 1000);
        break;

      case 'cache-clear':
        addMessage('output', '⏳ Очистка кэша...');
        setTimeout(() => {
          addMessage('output', '✓ Кэш очищен (освобождено 245MB)');
          toast({ title: "Кэш очищен", description: "Система оптимизирована" });
        }, 800);
        break;

      case 'theme':
        const theme = args[0];
        if (theme === 'light' || theme === 'dark') {
          addMessage('output', `✓ Тема изменена на ${theme}`);
        } else {
          addMessage('error', 'Ошибка: Используйте theme light или theme dark');
        }
        break;

      case 'restart':
        addMessage('output', '⚠️ Перезапуск системы...');
        setTimeout(() => {
          addMessage('output', '✓ Система перезапущена успешно');
        }, 1500);
        break;

      case 'clear':
        setMessages([{
          id: Date.now(),
          type: 'output',
          content: 'Консоль очищена',
          timestamp: new Date().toLocaleTimeString('ru-RU')
        }]);
        break;

      case '':
        break;

      default:
        addMessage('error', `Ошибка: Команда "${command}" не найдена. Введите "help" для списка команд.`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim()) {
      executeCommand(command);
      setCommand("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col bg-[#1a1a1a] border-2 border-primary">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-primary font-mono">
            <Icon name="Terminal" size={24} />
            <span>SubiSoftCND Console v2.0</span>
            <Badge variant="destructive" className="ml-auto">
              ВЫСШИЙ АДМИНИСТРАТОР
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 rounded-md border border-primary/30 bg-black p-4" ref={scrollRef}>
          <div className="space-y-2 font-mono text-sm">
            {messages.map((msg) => (
              <div key={msg.id} className="flex gap-2">
                <span className="text-primary/50 text-xs">[{msg.timestamp}]</span>
                <div className={`flex-1 ${
                  msg.type === 'command' ? 'text-primary font-bold' :
                  msg.type === 'error' ? 'text-red-500' :
                  msg.type === 'ai' ? 'text-blue-400' :
                  'text-green-400'
                }`}>
                  <pre className="whitespace-pre-wrap font-mono">{msg.content}</pre>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-mono">
              root@subisoft:~$
            </span>
            <Input
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              className="pl-40 bg-black border-primary/30 text-green-400 font-mono"
              placeholder="Введите команду..."
              autoFocus
            />
          </div>
          <Button type="submit" className="gap-2">
            <Icon name="Send" size={18} />
            Выполнить
          </Button>
        </form>

        <div className="flex gap-2 text-xs text-muted-foreground">
          <kbd className="px-2 py-1 bg-black rounded border border-primary/30 font-mono">help</kbd>
          <span>- список команд</span>
          <kbd className="px-2 py-1 bg-black rounded border border-primary/30 font-mono">ai [запрос]</kbd>
          <span>- ИИ-ассистент</span>
        </div>
      </DialogContent>
    </Dialog>
  );
};

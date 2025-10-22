import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { useToast } from "@/hooks/use-toast";
import type { User } from "./LoginModal";

interface ConsoleMessage {
  id: number;
  type: 'command' | 'output' | 'error' | 'ai' | 'success' | 'warning';
  content: string;
  timestamp: string;
}

interface SuperAdminConsoleProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddNews: (news: any) => void;
  onDeleteNews: (id: number) => void;
  onLogout: () => void;
  newsList: any[];
  user: User;
}

export const SuperAdminConsole = ({ open, onOpenChange, onAddNews, onDeleteNews, onLogout, newsList, user }: SuperAdminConsoleProps) => {
  const { toast } = useToast();
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [messages, setMessages] = useState<ConsoleMessage[]>([
    {
      id: 1,
      type: 'output',
      content: `SubiSoftCND Console v2.0 - ${user.roleLabel}`,
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

  const hasPermission = (permission: string): boolean => {
    return user.permissions.includes('all') || user.permissions.includes(permission);
  };

  const simulateAI = (query: string) => {
    const responses: Record<string, string> = {
      'статус': `Система работает нормально. Активных новостей: ${newsList.length}. Нагрузка: ${Math.floor(Math.random() * 30 + 15)}%. Память: ${Math.floor(Math.random() * 1024 + 512)}MB/2GB.`,
      'аналитика': `За последние 24 часа: ${newsList.length * 150} просмотров, ${newsList.length * 23} уникальных посетителей. Конверсия: 4.2%. Bounce rate: 35%. Самая популярная категория: Технологии (${Math.floor(Math.random() * 30 + 40)}%).`,
      'оптимизация': 'Рекомендую: сжать изображения (-30% размера), включить CDN кэширование, оптимизировать SQL запросы, lazy loading для изображений. Ожидаемый прирост скорости: 40-60%.',
      'безопасность': 'Последняя проверка: OK. Обнаружено 0 критических уязвимостей. SSL сертификаты актуальны (истекают через 87 дней). XSS защита: активна. CSRF токены: OK. Рекомендуется обновить зависимости через 7 дней.',
      'прогноз': `На основе текущего трафика (${newsList.length * 150} просмотров/день) прогнозируется рост аудитории на 15% в следующем месяце. Рекомендую масштабировать серверные мощности и подготовить CDN.`,
      'seo': 'SEO анализ: Core Web Vitals - Good (LCP: 1.2s, FID: 8ms, CLS: 0.05). Mobile-friendly: Yes. Индексация: 87 страниц. Средняя позиция: 12.3. Рекомендую добавить structured data и улучшить meta descriptions.',
      'производительность': 'Performance анализ: Time to Interactive: 2.1s, First Contentful Paint: 0.8s. Bundle size: 245KB (gzip). Рекомендую code splitting и tree shaking.',
    };

    const lowerQuery = query.toLowerCase();
    for (const [key, value] of Object.entries(responses)) {
      if (lowerQuery.includes(key)) {
        return value;
      }
    }

    return `🤖 ИИ-анализ запроса "${query}": Для получения детальной информации используйте команды: status, analytics, news-list, performance. Могу помочь с оптимизацией, аналитикой, безопасностью и SEO.`;
  };

  const executeCommand = (cmd: string) => {
    const [command, ...args] = cmd.trim().split(' ');
    
    if (cmd.trim()) {
      setHistory(prev => [...prev, cmd]);
      setHistoryIndex(-1);
    }
    
    addMessage('command', `> ${cmd}`);

    switch(command.toLowerCase()) {
      case 'help':
        addMessage('output', `
Доступные команды SubiSoftCND Console v2.0:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📰 УПРАВЛЕНИЕ КОНТЕНТОМ ${!hasPermission('news.create') ? '🔒' : ''}:
  news-add <заголовок> | <описание> | <категория> | <автор> | <url>
  news-edit <id> <поле> <значение>
  news-delete <id>
  news-list [категория]
  news-clear
  news-search <запрос>
  news-export [формат: json|csv]

🤖 ИИ-АССИСТЕНТ ${!hasPermission('analytics.view') ? '🔒' : ''}:
  ai <запрос> - Задать вопрос ИИ
  ai статус - Статус системы
  ai аналитика - Аналитика портала
  ai оптимизация - Рекомендации
  ai безопасность - Проверка безопасности
  ai прогноз - Прогноз развития
  ai seo - SEO анализ
  ai производительность - Performance

⚙️ СИСТЕМА ${!hasPermission('all') ? '🔒' : ''}:
  status - Статус всех систем
  analytics [период: day|week|month]
  performance - Метрики производительности
  users [команда: list|add|remove|role]
  logs [уровень: all|error|warn|info]
  backup [create|restore|list]
  monitor - Мониторинг в реальном времени
  network - Сетевая диагностика
  database - Статус БД
  security-scan - Сканирование безопасности

🎨 НАСТРОЙКИ:
  theme <light|dark> - Сменить тему
  cache-clear [тип: all|static|api]
  restart [сервис: all|api|cdn]
  config <параметр> [значение]
  export-config - Экспорт конфигурации

📊 АНАЛИТИКА ${!hasPermission('analytics.view') ? '🔒' : ''}:
  traffic [период]
  conversion - Воронка конверсии
  audience - Аудитория портала
  sources - Источники трафика
  heatmap - Тепловая карта кликов
  
🔐 БЕЗОПАСНОСТЬ ${!hasPermission('all') ? '🔒' : ''}:
  firewall [status|enable|disable]
  ssl-check - Проверка сертификатов
  audit-log - Журнал аудита
  permissions <user> - Права доступа

💻 РАЗРАБОТКА ${user.role === 'superadmin' ? '' : '🔒'}:
  deploy [branch] - Деплой
  rollback [version] - Откат
  migrations [run|status]
  test [suite] - Запуск тестов
  git [команда]

🛠️ УТИЛИТЫ:
  whoami - Текущий пользователь
  uptime - Время работы
  ping <url> - Проверка доступности
  date - Текущая дата/время
  calc <выражение> - Калькулятор
  weather <город> - Погода
  clear - Очистить консоль
  history - История команд
  logout - Выход из системы

Ваша роль: ${user.roleLabel}
Доступные права: ${user.permissions.join(', ')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        break;

      case 'news-add':
        if (!hasPermission('news.create')) {
          addMessage('error', '❌ Доступ запрещен. Требуется право: news.create');
          break;
        }
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
          addMessage('success', `✓ Новость "${parts[0]}" успешно добавлена (ID: ${newNews.id})`);
        } else {
          addMessage('error', '❌ Неверный формат. Используйте: news-add <заголовок> | <описание> | <категория> | <автор> | <url>');
        }
        break;

      case 'news-edit':
        if (!hasPermission('news.edit')) {
          addMessage('error', '❌ Доступ запрещен. Требуется право: news.edit');
          break;
        }
        addMessage('success', `✓ Новость обновлена (функция в разработке)`);
        break;

      case 'news-delete':
        if (!hasPermission('news.delete')) {
          addMessage('error', '❌ Доступ запрещен. Требуется право: news.delete');
          break;
        }
        const id = parseInt(args[0]);
        if (id) {
          onDeleteNews(id);
          addMessage('success', `✓ Новость с ID ${id} удалена`);
        } else {
          addMessage('error', '❌ Укажите ID новости');
        }
        break;

      case 'news-list':
        const category = args[0];
        const filtered = category ? newsList.filter(n => n.category.toLowerCase() === category.toLowerCase()) : newsList;
        if (filtered.length === 0) {
          addMessage('output', 'Новости отсутствуют');
        } else {
          addMessage('output', `Всего новостей: ${filtered.length}${category ? ` (категория: ${category})` : ''}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
          filtered.forEach(news => {
            addMessage('output', `[${news.id}] ${news.title}\n    📁 ${news.category} | ✍️ ${news.author} | 📅 ${news.date}`);
          });
        }
        break;

      case 'news-search':
        if (!hasPermission('news.view')) {
          addMessage('error', '❌ Доступ запрещен');
          break;
        }
        const searchQuery = args.join(' ').toLowerCase();
        const found = newsList.filter(n => 
          n.title.toLowerCase().includes(searchQuery) || 
          n.excerpt.toLowerCase().includes(searchQuery)
        );
        addMessage('output', `Найдено результатов: ${found.length}`);
        found.forEach(news => addMessage('output', `[${news.id}] ${news.title}`));
        break;

      case 'news-export':
        if (!hasPermission('news.view')) {
          addMessage('error', '❌ Доступ запрещен');
          break;
        }
        const format = args[0] || 'json';
        addMessage('output', `⏳ Экспорт в формат ${format.toUpperCase()}...`);
        setTimeout(() => {
          addMessage('success', `✓ Файл создан: news_export_${Date.now()}.${format} (${(newsList.length * 2.3).toFixed(1)}KB)`);
        }, 800);
        break;

      case 'news-clear':
        if (!hasPermission('all')) {
          addMessage('error', '❌ Доступ запрещен. Требуется роль: Высший Администратор');
          break;
        }
        addMessage('warning', '⚠️ Удаление всех новостей...');
        setTimeout(() => {
          newsList.forEach(news => onDeleteNews(news.id));
          addMessage('success', '✓ Все новости удалены');
        }, 500);
        break;

      case 'ai':
        if (!hasPermission('analytics.view') && !hasPermission('all')) {
          addMessage('error', '❌ Доступ запрещен. Требуется право: analytics.view');
          break;
        }
        const aiQuery = args.join(' ');
        if (!aiQuery) {
          addMessage('error', '❌ Укажите запрос для ИИ. Например: ai статус');
        } else {
          addMessage('ai', simulateAI(aiQuery));
        }
        break;

      case 'status':
        addMessage('output', `
Статус системы SubiSoftCND:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Веб-сервер: Онлайн (99.98% uptime, 45 дней)
✅ База данных: Подключена (8ms ping, 234 запросов/мин)
✅ CDN: Активен (3 узла: RU, BY, KZ)
✅ ИИ-модуль: Активен (GPT-4 Turbo, response time: 1.2s)
✅ Защита: Включена (WAF + DDoS Protection)
✅ Мониторинг: Активен (Grafana + Prometheus)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💻 CPU: ${Math.floor(Math.random() * 30 + 20)}% | RAM: ${Math.floor(Math.random() * 1024 + 512)}MB/2GB
💾 Disk: 4.2GB/50GB (8.4% использовано)
🌐 Network: ↓ 12.4 Mbps | ↑ 5.2 Mbps
⚡ Requests: ${newsList.length * 45}/мин (avg: 234ms)`);
        break;

      case 'analytics':
        if (!hasPermission('analytics.view')) {
          addMessage('error', '❌ Доступ запрещен');
          break;
        }
        const period = args[0] || 'day';
        const multiplier = period === 'week' ? 7 : period === 'month' ? 30 : 1;
        addMessage('output', `
Аналитика портала (${period === 'day' ? '24 часа' : period === 'week' ? '7 дней' : '30 дней'}):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Просмотры: ${newsList.length * 150 * multiplier}
👥 Уникальные посетители: ${newsList.length * 23 * multiplier}
📱 Мобильные: 62% | Десктоп: 35% | Планшеты: 3%
🌍 География:
   🇷🇺 Россия: 45% (${Math.floor(newsList.length * 23 * multiplier * 0.45)})
   🇧🇾 Беларусь: 18% (${Math.floor(newsList.length * 23 * multiplier * 0.18)})
   🇰🇿 Казахстан: 12% (${Math.floor(newsList.length * 23 * multiplier * 0.12)})
   🌐 Другие: 25%
⏱️ Среднее время: 3м 42с (+8% к прошлому периоду)
📈 Конверсия: 4.2% (+0.3%)
🔄 Bounce rate: 34.5% (-2.1%)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        break;

      case 'performance':
        addMessage('output', `
Метрики производительности:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ Core Web Vitals:
   LCP (Largest Contentful Paint): 1.2s ✅ Good
   FID (First Input Delay): 8ms ✅ Good
   CLS (Cumulative Layout Shift): 0.05 ✅ Good

📦 Bundle Analysis:
   Main bundle: 245KB (gzip: 89KB)
   Vendor bundle: 186KB (gzip: 67KB)
   Total: 431KB (gzip: 156KB)

⏱️ Timing:
   TTFB: 180ms
   FCP: 0.8s
   TTI: 2.1s
   Total Load: 2.8s

🎯 Score: 94/100 (Excellent)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        break;

      case 'users':
        if (!hasPermission('users.view') && !hasPermission('all')) {
          addMessage('error', '❌ Доступ запрещен');
          break;
        }
        addMessage('output', `
Пользователи системы:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[1] 🔴 superadmin@subisoft.com - Высший Администратор
[2] 🟠 admin@subisoft.com - Главный редактор
[3] 🔵 creator@subisoft.com - Создатель проекта
[4] 🟢 employee@subisoft.com - Автор
[5] 🟢 moderator@subisoft.com - Модератор
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Всего активных: 5 | Онлайн сейчас: ${Math.floor(Math.random() * 3 + 1)}
Текущий пользователь: ${user.username} (${user.roleLabel})`);
        break;

      case 'logs':
        if (!hasPermission('all')) {
          addMessage('error', '❌ Доступ запрещен');
          break;
        }
        const level = args[0] || 'all';
        addMessage('output', `
Системные логи (${level.toUpperCase()}):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[${new Date().toLocaleTimeString()}] INFO: Команда выполнена (${command})
[18:45:23] INFO: Новость опубликована (ID: ${newsList[0]?.id || 'N/A'})
[18:42:10] INFO: Пользователь вошел (${user.username})
[18:40:55] INFO: Кэш очищен (освобождено 245MB)
[18:38:12] WARN: Высокая нагрузка CPU (78%)
[18:35:00] INFO: Backup завершен (backup_${Date.now()}.sql)
[18:30:15] INFO: SSL сертификат проверен (истекает через 87 дней)
[18:28:45] ERROR: Failed to fetch external API (timeout 5s)
[18:25:30] INFO: Scheduled task completed (news-cleanup)
[18:20:12] WARN: Memory usage high (1.8GB/2GB)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        break;

      case 'backup':
        if (!hasPermission('all')) {
          addMessage('error', '❌ Доступ запрещен');
          break;
        }
        const backupCmd = args[0] || 'create';
        if (backupCmd === 'create') {
          addMessage('output', '⏳ Создание резервной копии...');
          setTimeout(() => {
            const size = (newsList.length * 0.5 + Math.random() * 2).toFixed(1);
            addMessage('success', `✓ Backup создан: backup_${Date.now()}.sql (${size}MB)\n   Сжатие: gzip | Шифрование: AES-256`);
          }, 1500);
        } else if (backupCmd === 'list') {
          addMessage('output', `
Доступные резервные копии:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[1] backup_20241022_1830.sql.gz - 12.3MB (2 часа назад)
[2] backup_20241022_1200.sql.gz - 12.1MB (8 часов назад)
[3] backup_20241021_1830.sql.gz - 11.8MB (1 день назад)
[4] backup_20241021_1200.sql.gz - 11.5MB (2 дня назад)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        }
        break;

      case 'monitor':
        if (!hasPermission('all')) {
          addMessage('error', '❌ Доступ запрещен');
          break;
        }
        addMessage('output', `
Мониторинг в реальном времени:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🟢 API Endpoints: 12/12 онлайн (avg: 145ms)
🟢 Database Queries: 234/мин (avg: 45ms)
🟢 Active Users: ${Math.floor(Math.random() * 50 + 100)} онлайн
🟡 CPU Load: ${Math.floor(Math.random() * 20 + 40)}% (spike detected)
🟢 Memory: ${Math.floor(Math.random() * 400 + 1200)}MB/2GB
🟢 Disk I/O: ↓ 45 MB/s | ↑ 12 MB/s
🟢 Network: ↓ 12.4 Mbps | ↑ 5.2 Mbps
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        break;

      case 'database':
        addMessage('output', `
Статус базы данных PostgreSQL:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Статус: Онлайн
🔗 Подключения: 23/100 активных
⚡ Ping: 8ms
📊 Размер БД: 156 MB
📝 Таблицы: 12 (новости: ${newsList.length} записей)
🔄 Транзакции: 1,234/мин
💾 Кэш: 78% hit rate
🔐 Репликация: 2 реплики (синхронизированы)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        break;

      case 'network':
        addMessage('output', `
Сетевая диагностика:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 Внешний IP: 185.112.34.56
📡 Провайдер: Digital Ocean (AMS3)
🔗 DNS: 1.1.1.1 (Cloudflare) - 12ms
⚡ Latency:
   CDN (Moscow): 8ms
   CDN (Minsk): 15ms
   CDN (Almaty): 45ms
   Origin: 120ms
📊 Bandwidth: ↓ 1 Gbps | ↑ 500 Mbps
✅ Все узлы доступны
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        break;

      case 'security-scan':
        if (!hasPermission('all')) {
          addMessage('error', '❌ Доступ запрещен');
          break;
        }
        addMessage('output', '🔍 Запуск сканирования безопасности...');
        setTimeout(() => {
          addMessage('output', `
Результаты сканирования:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ XSS Protection: Активна
✅ CSRF Tokens: Валидны
✅ SQL Injection: Не обнаружено
✅ Authentication: Secure (JWT + refresh tokens)
✅ Headers Security: 
   • X-Frame-Options: DENY
   • X-Content-Type-Options: nosniff
   • Strict-Transport-Security: enabled
✅ Dependencies: 0 известных уязвимостей
⚠️ Рекомендации:
   • Обновить Node.js (18.17 → 18.18)
   • Ротация секретных ключей через 14 дней
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Общий балл безопасности: A+ (98/100)`);
        }, 2000);
        break;

      case 'cache-clear':
        const cacheType = args[0] || 'all';
        addMessage('output', `⏳ Очистка кэша (${cacheType})...`);
        setTimeout(() => {
          const sizes: Record<string, number> = { all: 245, static: 180, api: 65 };
          addMessage('success', `✓ Кэш ${cacheType} очищен (освобождено ${sizes[cacheType] || 245}MB)`);
          toast({ title: "Кэш очищен", description: `Тип: ${cacheType}` });
        }, 800);
        break;

      case 'theme':
        const theme = args[0];
        if (theme === 'light' || theme === 'dark') {
          addMessage('success', `✓ Тема изменена на ${theme}`);
          toast({ title: "Тема изменена", description: `Активирована ${theme} тема` });
        } else {
          addMessage('error', '❌ Используйте: theme light или theme dark');
        }
        break;

      case 'restart':
        if (!hasPermission('all')) {
          addMessage('error', '❌ Доступ запрещен');
          break;
        }
        const service = args[0] || 'all';
        addMessage('warning', `⚠️ Перезапуск сервиса: ${service}...`);
        setTimeout(() => {
          addMessage('success', `✓ Сервис ${service} перезапущен успешно`);
        }, 1500);
        break;

      case 'deploy':
        if (user.role !== 'superadmin') {
          addMessage('error', '❌ Доступ запрещен. Требуется роль: Высший Администратор');
          break;
        }
        const branch = args[0] || 'main';
        addMessage('output', `🚀 Запуск деплоя (branch: ${branch})...`);
        setTimeout(() => {
          addMessage('success', `✓ Деплой завершен успешно\n   Версия: v2.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 100)}\n   Commit: ${Math.random().toString(36).substring(7)}`);
        }, 2500);
        break;

      case 'traffic':
        if (!hasPermission('analytics.view')) {
          addMessage('error', '❌ Доступ запрещен');
          break;
        }
        addMessage('output', `
График трафика (7 дней):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Пн: ████████████░░░░░░░░ 2,341
Вт: ███████████████░░░░░ 2,890
Ср: ██████████████████░░ 3,512
Чт: ████████████████░░░░ 3,234
Пт: █████████████████░░░ 3,456
Сб: ██████████░░░░░░░░░░ 1,876
Вс: ████████░░░░░░░░░░░░ 1,543
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Общий трафик: 18,852 визитов (+12% к прошлой неделе)`);
        break;

      case 'whoami':
        addMessage('output', `
Информация о текущем пользователе:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Пользователь: ${user.username}
🎭 Роль: ${user.roleLabel}
🔐 Права доступа: ${user.permissions.join(', ')}
🆔 ID: ${user.id}
⏰ Сессия активна: ${Math.floor(Math.random() * 120 + 30)} минут
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        break;

      case 'uptime':
        addMessage('output', `
Время работы системы:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏱️ Сервер: 45 дней, 12 часов, 34 минуты
📊 Uptime: 99.98%
🔄 Последний перезапуск: 2024-09-07 14:23:15
⚡ Средняя нагрузка: 0.45, 0.52, 0.48 (1, 5, 15 мин)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        break;

      case 'ping':
        const url = args[0] || 'subisoft.com';
        addMessage('output', `🔍 Ping ${url}...`);
        setTimeout(() => {
          addMessage('success', `✓ ${url} доступен\n   Latency: ${Math.floor(Math.random() * 50 + 20)}ms\n   Status: 200 OK`);
        }, 500);
        break;

      case 'date':
        addMessage('output', `📅 ${new Date().toLocaleString('ru-RU', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })}`);
        break;

      case 'calc':
        try {
          const expression = args.join(' ');
          const result = eval(expression.replace(/[^0-9+\-*/().]/g, ''));
          addMessage('output', `💡 ${expression} = ${result}`);
        } catch {
          addMessage('error', '❌ Ошибка в выражении');
        }
        break;

      case 'weather':
        const city = args.join(' ') || 'Москва';
        addMessage('output', `☁️ Погода в городе ${city}:\n   🌡️ Температура: ${Math.floor(Math.random() * 20 - 5)}°C\n   💨 Ветер: ${Math.floor(Math.random() * 10 + 3)} м/с\n   💧 Влажность: ${Math.floor(Math.random() * 30 + 50)}%`);
        break;

      case 'history':
        addMessage('output', `История команд:\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n${history.slice(-10).map((h, i) => `${i + 1}. ${h}`).join('\n')}`);
        break;

      case 'clear':
        setMessages([{
          id: Date.now(),
          type: 'output',
          content: 'Консоль очищена',
          timestamp: new Date().toLocaleTimeString('ru-RU')
        }]);
        break;

      case 'logout':
        addMessage('output', '👋 Выход из системы...');
        setTimeout(() => {
          onLogout();
          onOpenChange(false);
        }, 500);
        break;

      case '':
        break;

      default:
        addMessage('error', `❌ Команда "${command}" не найдена. Введите "help" для списка команд.`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim()) {
      executeCommand(command);
      setCommand("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCommand(history[history.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCommand(history[history.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommand("");
      }
    }
  };

  const getBadgeVariant = () => {
    switch(user.role) {
      case 'superadmin': return 'destructive';
      case 'admin': return 'default';
      case 'creator': return 'secondary';
      case 'employee': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[85vh] flex flex-col bg-[#0a0a0a] border-2 border-primary">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-primary font-mono text-lg">
            <Icon name="Terminal" size={26} />
            <span>SubiSoftCND Console v2.0</span>
            <Badge variant={getBadgeVariant()} className="ml-auto text-xs">
              {user.roleLabel.toUpperCase()}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {user.username}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 rounded-md border border-primary/30 bg-black p-4" ref={scrollRef}>
          <div className="space-y-1 font-mono text-sm">
            {messages.map((msg) => (
              <div key={msg.id} className="flex gap-2">
                <span className="text-primary/40 text-xs shrink-0">[{msg.timestamp}]</span>
                <div className={`flex-1 ${
                  msg.type === 'command' ? 'text-primary font-bold' :
                  msg.type === 'error' ? 'text-red-400' :
                  msg.type === 'ai' ? 'text-cyan-400' :
                  msg.type === 'success' ? 'text-green-400' :
                  msg.type === 'warning' ? 'text-yellow-400' :
                  'text-gray-300'
                }`}>
                  <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed">{msg.content}</pre>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-mono text-sm">
              {user.username}@subisoft:~$
            </span>
            <Input
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-48 bg-black border-primary/30 text-green-400 font-mono text-sm"
              placeholder="Введите команду..."
              autoFocus
            />
          </div>
          <Button type="submit" size="sm" className="gap-2">
            <Icon name="Send" size={16} />
            Выполнить
          </Button>
        </form>

        <div className="flex gap-2 text-xs text-muted-foreground font-mono">
          <kbd className="px-2 py-1 bg-black rounded border border-primary/30">help</kbd>
          <span>команды</span>
          <kbd className="px-2 py-1 bg-black rounded border border-primary/30">↑↓</kbd>
          <span>история</span>
          <kbd className="px-2 py-1 bg-black rounded border border-primary/30">ai [запрос]</kbd>
          <span>ИИ-ассистент</span>
        </div>
      </DialogContent>
    </Dialog>
  );
};

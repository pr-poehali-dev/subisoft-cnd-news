import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { useToast } from "@/hooks/use-toast";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin: (user: User) => void;
}

export interface User {
  id: number;
  username: string;
  role: 'founder' | 'superadmin' | 'admin' | 'seniordev' | 'developer' | 'moderator' | 'employee';
  roleLabel: string;
  rank: number;
  permissions: string[];
  color: string;
}

const USERS: Record<string, { password: string; user: User }> = {
  'founder': {
    password: 'founder123',
    user: {
      id: 1,
      username: 'founder',
      role: 'founder',
      roleLabel: 'Основатель',
      rank: 10,
      permissions: ['all', 'god.mode'],
      color: '#FFD700'
    }
  },
  'superadmin': {
    password: 'super123',
    user: {
      id: 2,
      username: 'superadmin',
      role: 'superadmin',
      roleLabel: 'Высший Администратор',
      rank: 9,
      permissions: ['all'],
      color: '#FF4444'
    }
  },
  'admin': {
    password: 'admin123',
    user: {
      id: 3,
      username: 'admin',
      role: 'admin',
      roleLabel: 'Администратор',
      rank: 8,
      permissions: ['news.all', 'users.view', 'users.moderate', 'analytics.full', 'settings.edit'],
      color: '#FF8C00'
    }
  },
  'seniordev': {
    password: 'senior123',
    user: {
      id: 4,
      username: 'seniordev',
      role: 'seniordev',
      roleLabel: 'Старший Разработчик',
      rank: 7,
      permissions: ['news.all', 'analytics.full', 'deploy.access', 'database.access'],
      color: '#00CED1'
    }
  },
  'developer': {
    password: 'dev123',
    user: {
      id: 5,
      username: 'developer',
      role: 'developer',
      roleLabel: 'Разработчик',
      rank: 6,
      permissions: ['news.create', 'news.edit', 'analytics.view', 'deploy.view'],
      color: '#4169E1'
    }
  },
  'moderator': {
    password: 'mod123',
    user: {
      id: 6,
      username: 'moderator',
      role: 'moderator',
      roleLabel: 'Модератор',
      rank: 5,
      permissions: ['news.create', 'news.edit', 'news.moderate', 'users.view'],
      color: '#9370DB'
    }
  },
  'employee': {
    password: 'employee123',
    user: {
      id: 7,
      username: 'employee',
      role: 'employee',
      roleLabel: 'Сотрудник',
      rank: 4,
      permissions: ['news.create', 'news.view'],
      color: '#90EE90'
    }
  }
};

export const LoginModal = ({ open, onOpenChange, onLogin }: LoginModalProps) => {
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showDemo, setShowDemo] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const userData = USERS[username.toLowerCase()];
    
    if (userData && userData.password === password) {
      onLogin(userData.user);
      toast({
        title: "Авторизация успешна",
        description: `Добро пожаловать, ${userData.user.roleLabel}!`,
      });
      setUsername("");
      setPassword("");
      onOpenChange(false);
    } else {
      toast({
        title: "Ошибка авторизации",
        description: "Неверное имя пользователя или пароль",
        variant: "destructive",
      });
    }
  };

  const handleDemoLogin = (role: keyof typeof USERS) => {
    onLogin(USERS[role].user);
    toast({
      title: "Демо-вход выполнен",
      description: `Вы вошли как ${USERS[role].user.roleLabel}`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Icon name="Lock" size={24} />
            Вход в систему SubiSoftCND
          </DialogTitle>
          <DialogDescription>
            Введите учетные данные для доступа к консоли управления
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Имя пользователя</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="founder"
              required
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <Button type="submit" className="w-full gap-2">
            <Icon name="LogIn" size={18} />
            Войти
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Или
            </span>
          </div>
        </div>

        <Button 
          variant="outline" 
          onClick={() => setShowDemo(!showDemo)}
          className="w-full"
        >
          {showDemo ? 'Скрыть иерархию рангов' : 'Показать иерархию рангов'}
        </Button>

        {showDemo && (
          <div className="space-y-2 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-3">Иерархия рангов SubiSoftCND:</p>
            
            <div className="space-y-2">
              <button
                onClick={() => handleDemoLogin('founder')}
                className="w-full flex items-center justify-between p-3 border-2 border-yellow-500/30 rounded-lg hover:bg-yellow-500/10 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Icon name="Crown" size={18} className="text-yellow-500" />
                  <div className="text-left">
                    <div className="font-medium">Основатель</div>
                    <div className="text-xs text-muted-foreground">Ранг 10 • GOD MODE</div>
                  </div>
                </div>
                <Badge className="bg-yellow-500 text-black">★ FOUNDER</Badge>
              </button>

              <button
                onClick={() => handleDemoLogin('superadmin')}
                className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-background transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Icon name="ShieldCheck" size={18} className="text-red-500" />
                  <div className="text-left">
                    <div className="font-medium">Высший Администратор</div>
                    <div className="text-xs text-muted-foreground">Ранг 9 • Полный доступ</div>
                  </div>
                </div>
                <Badge variant="destructive">SUPER</Badge>
              </button>

              <button
                onClick={() => handleDemoLogin('admin')}
                className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-background transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Icon name="Shield" size={18} className="text-orange-500" />
                  <div className="text-left">
                    <div className="font-medium">Администратор</div>
                    <div className="text-xs text-muted-foreground">Ранг 8 • Управление</div>
                  </div>
                </div>
                <Badge variant="secondary">ADMIN</Badge>
              </button>

              <button
                onClick={() => handleDemoLogin('seniordev')}
                className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-background transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Icon name="Code2" size={18} className="text-cyan-500" />
                  <div className="text-left">
                    <div className="font-medium">Старший Разработчик</div>
                    <div className="text-xs text-muted-foreground">Ранг 7 • Разработка</div>
                  </div>
                </div>
                <Badge variant="outline" className="text-cyan-500 border-cyan-500">SENIOR</Badge>
              </button>

              <button
                onClick={() => handleDemoLogin('developer')}
                className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-background transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Icon name="Code" size={18} className="text-blue-500" />
                  <div className="text-left">
                    <div className="font-medium">Разработчик</div>
                    <div className="text-xs text-muted-foreground">Ранг 6 • Разработка</div>
                  </div>
                </div>
                <Badge variant="outline" className="text-blue-500 border-blue-500">DEV</Badge>
              </button>

              <button
                onClick={() => handleDemoLogin('moderator')}
                className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-background transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Icon name="UserCheck" size={18} className="text-purple-500" />
                  <div className="text-left">
                    <div className="font-medium">Модератор</div>
                    <div className="text-xs text-muted-foreground">Ранг 5 • Модерация</div>
                  </div>
                </div>
                <Badge variant="outline" className="text-purple-500 border-purple-500">MOD</Badge>
              </button>

              <button
                onClick={() => handleDemoLogin('employee')}
                className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-background transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Icon name="User" size={18} className="text-green-500" />
                  <div className="text-left">
                    <div className="font-medium">Сотрудник</div>
                    <div className="text-xs text-muted-foreground">Ранг 4 • Базовый доступ</div>
                  </div>
                </div>
                <Badge variant="outline" className="text-green-500 border-green-500">STAFF</Badge>
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

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
  role: 'superadmin' | 'admin' | 'creator' | 'employee';
  roleLabel: string;
  permissions: string[];
}

const USERS: Record<string, { password: string; user: User }> = {
  'superadmin': {
    password: 'super123',
    user: {
      id: 1,
      username: 'superadmin',
      role: 'superadmin',
      roleLabel: 'Высший Администратор',
      permissions: ['all']
    }
  },
  'admin': {
    password: 'admin123',
    user: {
      id: 2,
      username: 'admin',
      role: 'admin',
      roleLabel: 'Администратор',
      permissions: ['news.create', 'news.edit', 'news.delete', 'users.view', 'analytics.view']
    }
  },
  'creator': {
    password: 'creator123',
    user: {
      id: 3,
      username: 'creator',
      role: 'creator',
      roleLabel: 'Создатель проекта',
      permissions: ['news.create', 'news.edit', 'analytics.view', 'settings.edit']
    }
  },
  'employee': {
    password: 'employee123',
    user: {
      id: 4,
      username: 'employee',
      role: 'employee',
      roleLabel: 'Сотрудник',
      permissions: ['news.create', 'news.view']
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
      <DialogContent className="max-w-md">
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
              placeholder="superadmin"
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
          {showDemo ? 'Скрыть демо-доступы' : 'Показать демо-доступы'}
        </Button>

        {showDemo && (
          <div className="space-y-2 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-3">Демо-аккаунты:</p>
            
            <div className="space-y-2">
              <button
                onClick={() => handleDemoLogin('superadmin')}
                className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-background transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Icon name="ShieldCheck" size={18} className="text-red-500" />
                  <div className="text-left">
                    <div className="font-medium">Высший Администратор</div>
                    <div className="text-xs text-muted-foreground">Полный доступ</div>
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
                    <div className="text-xs text-muted-foreground">Управление контентом</div>
                  </div>
                </div>
                <Badge variant="secondary">ADMIN</Badge>
              </button>

              <button
                onClick={() => handleDemoLogin('creator')}
                className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-background transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Icon name="User" size={18} className="text-blue-500" />
                  <div className="text-left">
                    <div className="font-medium">Создатель проекта</div>
                    <div className="text-xs text-muted-foreground">Создание и редактирование</div>
                  </div>
                </div>
                <Badge variant="outline">CREATOR</Badge>
              </button>

              <button
                onClick={() => handleDemoLogin('employee')}
                className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-background transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Icon name="UserCircle" size={18} className="text-green-500" />
                  <div className="text-left">
                    <div className="font-medium">Сотрудник</div>
                    <div className="text-xs text-muted-foreground">Базовый доступ</div>
                  </div>
                </div>
                <Badge variant="outline">EMPLOYEE</Badge>
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface NewsCardProps {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  date: string;
  author: string;
}

export const NewsCard = ({ title, excerpt, category, image, date, author }: NewsCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
          {category}
        </Badge>
      </div>
      <CardContent className="p-6">
        <div className="text-sm text-muted-foreground mb-2">
          {date} • {author}
        </div>
        <h3 className="text-xl font-heading font-bold mb-3 line-clamp-2">
          {title}
        </h3>
        <p className="text-muted-foreground mb-4 line-clamp-3">
          {excerpt}
        </p>
        <Button variant="default" className="w-full">
          Читать далее
        </Button>
      </CardContent>
    </Card>
  );
};

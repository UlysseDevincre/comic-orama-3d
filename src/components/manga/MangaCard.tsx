import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Manga } from "@/types/manga";
import { BookOpen, Calendar, Star, User } from "lucide-react";

interface MangaCardProps {
  manga: Manga;
  onEdit: (manga: Manga) => void;
}

export function MangaCard({ manga, onEdit }: MangaCardProps) {
  const completionPercentage = (manga.ownedVolumes.length / manga.totalVolumes) * 100;
  
  const getStatusColor = (status: Manga['status']) => {
    switch (status) {
      case 'completed': return 'bg-book-green';
      case 'ongoing': return 'bg-book-blue';
      case 'planned': return 'bg-book-orange';
      case 'dropped': return 'bg-book-red';
      default: return 'bg-muted';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {manga.title}
          </CardTitle>
          <Badge className={`${getStatusColor(manga.status)} text-white capitalize shrink-0 ml-2`}>
            {manga.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <User className="w-4 h-4" />
          <span className="text-sm">{manga.author}</span>
        </div>
        
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">{manga.startYear}</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              Progress
            </span>
            <span className="font-medium">
              {manga.ownedVolumes.length} / {manga.totalVolumes}
            </span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>
        
        {manga.rating && (
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-accent text-accent" />
            <span className="text-sm font-medium">{manga.rating}/10</span>
          </div>
        )}
        
        <div className="flex flex-wrap gap-1">
          {manga.genre.slice(0, 3).map((genre) => (
            <Badge key={genre} variant="secondary" className="text-xs">
              {genre}
            </Badge>
          ))}
          {manga.genre.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{manga.genre.length - 3}
            </Badge>
          )}
        </div>
        
        <Button 
          onClick={() => onEdit(manga)} 
          variant="outline" 
          className="w-full"
        >
          Edit Details
        </Button>
      </CardContent>
    </Card>
  );
}
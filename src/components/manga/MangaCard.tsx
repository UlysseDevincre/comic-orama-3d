import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Manga } from "@/types/manga";
import { BookOpen, Calendar, User, Plus, Minus, PlusCircle } from "lucide-react"; // Import PlusCircle

interface MangaCardProps {
  manga: Manga;
  onEdit: (manga: Manga) => void;
  onAddVolume: (mangaId: string, volume: number) => void;
  onRemoveVolume: (mangaId: string, volume: number) => void;
  onAddAllVolumes: (mangaId: string) => void; // New prop for adding all volumes
}

export function MangaCard({ manga, onEdit, onAddVolume, onRemoveVolume, onAddAllVolumes }: MangaCardProps) {
  const completionPercentage = (manga.ownedVolumes.length / manga.totalVolumes) * 100;
  const isFullyOwned = manga.ownedVolumes.length === manga.totalVolumes;

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
    <Card className="hover:shadow-lg transition-shadow duration-300 flex flex-col">
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
      
      <CardContent className="space-y-4 flex-grow flex flex-col">
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

        <div className="space-y-2">
          <div className="text-sm font-medium">Volumes</div>
          <div className="grid grid-cols-5 gap-1 max-h-32 overflow-y-auto p-1 border rounded-md">
            {Array.from({ length: manga.totalVolumes }, (_, i) => {
              const volume = i + 1;
              const isOwned = manga.ownedVolumes.includes(volume);
              return (
                <div key={volume} className="flex items-center justify-between p-1 rounded border border-border/50">
                  <span className={`text-xs ${isOwned ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {volume}
                  </span>
                  {isOwned ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-4 w-4 p-0 hover:bg-destructive/20"
                      onClick={() => onRemoveVolume(manga.id, volume)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-4 w-4 p-0 hover:bg-primary/20"
                      onClick={() => onAddVolume(manga.id, volume)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Action buttons at the bottom */}
        <div className="mt-auto pt-4 space-y-2">
          {!isFullyOwned && (
            <Button 
              onClick={() => onAddAllVolumes(manga.id)} 
              variant="secondary" 
              className="w-full"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add All Volumes
            </Button>
          )}
          <Button 
            onClick={() => onEdit(manga)} 
            variant="outline" 
            className="w-full"
          >
            Edit Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
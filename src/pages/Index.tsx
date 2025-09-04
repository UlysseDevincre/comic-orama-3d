import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bookshelf3D } from "@/components/manga/Bookshelf3D";
import { MangaCard } from "@/components/manga/MangaCard";
import { AddMangaDialog } from "@/components/manga/AddMangaDialog";
import { EditMangaDialog } from "@/components/manga/EditMangaDialog";
import { Manga } from "@/types/manga";
import { BookOpen, Eye, Library } from "lucide-react";
import { toast } from "sonner";

const initialMangaData: Manga[] = [
  {
    id: '1',
    title: 'One Piece',
    author: 'Eiichiro Oda',
    totalVolumes: 106,
    ownedVolumes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    status: 'ongoing',
    startYear: 1997,
    color: 'blue',
    description: 'Follow Monkey D. Luffy as he explores the Grand Line to find One Piece and become Pirate King.'
  },
  {
    id: '2',
    title: 'Attack on Titan',
    author: 'Hajime Isayama',
    totalVolumes: 34,
    ownedVolumes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34],
    status: 'completed',
    startYear: 2009,
    color: 'red',
    description: 'Humanity fights for survival against giant humanoid Titans.'
  },
  {
    id: '3',
    title: 'Demon Slayer',
    author: 'Koyoharu Gotouge',
    totalVolumes: 23,
    ownedVolumes: [1, 2, 3, 4, 5],
    status: 'completed',
    startYear: 2016,
    color: 'green',
    description: 'Tanjiro becomes a demon slayer to save his sister and avenge his family.'
  },
  {
    id: '4',
    title: 'My Hero Academia',
    author: 'Kohei Horikoshi',
    totalVolumes: 38,
    ownedVolumes: [1, 2, 3, 4, 5, 6, 7, 8],
    status: 'ongoing',
    startYear: 2014,
    color: 'orange',
    description: 'In a world of superheroes, Izuku dreams of becoming the greatest hero.'
  },
  {
    id: '5',
    title: 'Death Note',
    author: 'Tsugumi Ohba',
    totalVolumes: 12,
    ownedVolumes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    status: 'completed',
    startYear: 2003,
    color: 'purple',
    description: 'Light Yagami finds a notebook that can kill anyone whose name is written in it.'
  }
];

const STORAGE_KEY = 'manga-collection';

const Index = () => {
  const [mangaList, setMangaList] = useState<Manga[]>(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      return savedData ? JSON.parse(savedData) : initialMangaData;
    } catch (error) {
      console.error("Failed to parse manga data from localStorage", error);
      return initialMangaData;
    }
  });

  const [selectedManga, setSelectedManga] = useState<Manga | null>(null);
  const [activeTab, setActiveTab] = useState('3d');
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mangaList));
    } catch (error) {
      console.error("Failed to save manga data to localStorage", error);
    }
  }, [mangaList]);

  const handleAddManga = (newManga: Omit<Manga, 'id'>) => {
    const manga: Manga = {
      ...newManga,
      id: Date.now().toString()
    };
    setMangaList(prev => [...prev, manga]);
  };

  const handleEditManga = (manga: Manga) => {
    setSelectedManga(manga);
    setEditDialogOpen(true);
  };

  const handleUpdateManga = (updatedManga: Manga) => {
    setMangaList(prev => prev.map(manga => 
      manga.id === updatedManga.id ? updatedManga : manga
    ));
  };

  const handleAddVolume = (mangaId: string, volume: number) => {
    setMangaList(prev => prev.map(manga => 
      manga.id === mangaId 
        ? { ...manga, ownedVolumes: [...manga.ownedVolumes, volume].sort((a, b) => a - b) }
        : manga
    ));
    toast.success(`Added volume ${volume} to collection`);
  };

  const handleRemoveVolume = (mangaId: string, volume: number) => {
    setMangaList(prev => prev.map(manga => 
      manga.id === mangaId 
        ? { ...manga, ownedVolumes: manga.ownedVolumes.filter(v => v !== volume) }
        : manga
    ));
    toast.success(`Removed volume ${volume} from collection`);
  };

  // New handler function for adding all volumes
  const handleAddAllVolumes = (mangaId: string) => {
    setMangaList(prev => prev.map(manga => {
      if (manga.id === mangaId) {
        const allVolumes = Array.from({ length: manga.totalVolumes }, (_, i) => i + 1);
        toast.success(`Added all ${manga.totalVolumes} volumes of "${manga.title}"!`);
        return { ...manga, ownedVolumes: allVolumes };
      }
      return manga;
    }));
  };

  const totalVolumes = mangaList.reduce((sum, manga) => sum + manga.totalVolumes, 0);
  const ownedVolumes = mangaList.reduce((sum, manga) => sum + manga.ownedVolumes.length, 0);
  const completedSeries = mangaList.filter(manga => manga.ownedVolumes.length === manga.totalVolumes).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary-glow">
                <Library className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Manga Shelf</h1>
                <p className="text-sm text-muted-foreground">Your personal 3D manga library</p>
              </div>
            </div>
            <AddMangaDialog onAdd={handleAddManga} />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Series</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mangaList.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Volumes Owned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ownedVolumes} / {totalVolumes}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed Series</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedSeries}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="3d" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              3D Bookshelf
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Collection List
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="3d" className="space-y-0">
            <Card className="h-[600px] overflow-hidden">
              <CardContent className="p-0 h-full">
                <Bookshelf3D 
                  mangaList={mangaList} 
                  onMangaSelect={(manga) => {
                    setSelectedManga(manga);
                    toast.info(`Selected: ${manga.title}`);
                  }}
                />
              </CardContent>
            </Card>
            <div className="text-center text-sm text-muted-foreground mt-4">
              Drag up/down to move camera • Scroll to zoom • Click books to select
            </div>
          </TabsContent>
          
          <TabsContent value="list" className="space-y-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mangaList.map((manga) => (
                <MangaCard
                  key={manga.id}
                  manga={manga}
                  onEdit={handleEditManga}
                  onAddVolume={handleAddVolume}
                  onRemoveVolume={handleRemoveVolume}
                  onAddAllVolumes={handleAddAllVolumes} // Pass the new handler
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <EditMangaDialog
        manga={selectedManga}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onEdit={handleUpdateManga}
      />
    </div>
  );
};

export default Index;
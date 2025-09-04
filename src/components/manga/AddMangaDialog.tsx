import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Manga } from "@/types/manga";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface AddMangaDialogProps {
  onAdd: (manga: Omit<Manga, 'id'>) => void;
}

const bookColors = [
  { value: 'red', label: 'Red' },
  { value: 'blue', label: 'Blue' },
  { value: 'green', label: 'Green' },
  { value: 'orange', label: 'Orange' },
  { value: 'purple', label: 'Purple' },
  { value: 'brown', label: 'Brown' },
];

const statusOptions = [
  { value: 'planned', label: 'Planned' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
  { value: 'dropped', label: 'Dropped' },
];

export function AddMangaDialog({ onAdd }: AddMangaDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    totalVolumes: '',
    status: 'planned' as Manga['status'],
    genre: '',
    startYear: '',
    color: 'blue' as Manga['color'],
    description: '',
    rating: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.author || !formData.totalVolumes) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newManga: Omit<Manga, 'id'> = {
      title: formData.title,
      author: formData.author,
      totalVolumes: parseInt(formData.totalVolumes),
      ownedVolumes: [],
      status: formData.status,
      genre: formData.genre.split(',').map(g => g.trim()).filter(g => g),
      startYear: parseInt(formData.startYear) || new Date().getFullYear(),
      color: formData.color,
      description: formData.description || undefined,
      rating: formData.rating ? parseFloat(formData.rating) : undefined,
    };

    onAdd(newManga);
    setFormData({
      title: '',
      author: '',
      totalVolumes: '',
      status: 'planned',
      genre: '',
      startYear: '',
      color: 'blue',
      description: '',
      rating: ''
    });
    setOpen(false);
    toast.success(`Added "${formData.title}" to your collection!`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg">
          <Plus className="w-4 h-4 mr-2" />
          Add Manga
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Manga Series</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter manga title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="author">Author *</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              placeholder="Enter author name"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalVolumes">Total Volumes *</Label>
              <Input
                id="totalVolumes"
                type="number"
                min="1"
                value={formData.totalVolumes}
                onChange={(e) => setFormData({ ...formData, totalVolumes: e.target.value })}
                placeholder="0"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="startYear">Year</Label>
              <Input
                id="startYear"
                type="number"
                min="1900"
                max={new Date().getFullYear() + 5}
                value={formData.startYear}
                onChange={(e) => setFormData({ ...formData, startYear: e.target.value })}
                placeholder={new Date().getFullYear().toString()}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as Manga['status'] })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="color">Spine Color</Label>
              <Select value={formData.color} onValueChange={(value) => setFormData({ ...formData, color: value as Manga['color'] })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {bookColors.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      {color.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="genre">Genres (comma-separated)</Label>
            <Input
              id="genre"
              value={formData.genre}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
              placeholder="Action, Adventure, Fantasy"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="rating">Rating (1-10)</Label>
            <Input
              id="rating"
              type="number"
              min="1"
              max="10"
              step="0.1"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
              placeholder="8.5"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the manga"
              rows={3}
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Manga
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Manga } from "@/types/manga";
import { toast } from "sonner";

interface EditMangaDialogProps {
  manga: Manga | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (manga: Manga) => void;
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

export function EditMangaDialog({ manga, open, onOpenChange, onEdit }: EditMangaDialogProps) {
  const [formData, setFormData] = useState({
    title: manga?.title || '',
    author: manga?.author || '',
    totalVolumes: manga?.totalVolumes?.toString() || '',
    status: manga?.status || 'planned' as Manga['status'],
    startYear: manga?.startYear?.toString() || '',
    color: manga?.color || 'blue' as Manga['color'],
    description: manga?.description || ''
  });

  // Update form data when manga prop changes
  useState(() => {
    if (manga) {
      setFormData({
        title: manga.title,
        author: manga.author,
        totalVolumes: manga.totalVolumes.toString(),
        status: manga.status,
        startYear: manga.startYear.toString(),
        color: manga.color,
        description: manga.description || ''
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.author || !formData.totalVolumes || !manga) {
      toast.error("Please fill in all required fields");
      return;
    }

    const updatedManga: Manga = {
      ...manga,
      title: formData.title,
      author: formData.author,
      totalVolumes: parseInt(formData.totalVolumes),
      status: formData.status,
      startYear: parseInt(formData.startYear) || new Date().getFullYear(),
      color: formData.color,
      description: formData.description || undefined,
    };

    onEdit(updatedManga);
    onOpenChange(false);
    toast.success(`Updated "${formData.title}"`);
  };

  if (!manga) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Manga Series</DialogTitle>
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
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Update Manga
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
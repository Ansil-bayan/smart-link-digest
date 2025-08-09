import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Loader2, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface AddBookmarkDialogProps {
  onBookmarkAdded: () => void;
}

const AddBookmarkDialog = ({ onBookmarkAdded }: AddBookmarkDialogProps) => {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const processUrl = async () => {
    if (!url.trim()) return;
    
    setProcessing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('process-url', {
        body: { url: url.trim() }
      });

      if (error) {
        console.error('Error processing URL:', error);
        toast({
          title: "Processing failed",
          description: "Could not process URL. Please add details manually.",
          variant: "destructive",
        });
      } else if (data) {
        setTitle(data.title || '');
        setSummary(data.summary || '');
      }
    } catch (error) {
      console.error('Error processing URL:', error);
      toast({
        title: "Processing failed",
        description: "Could not process URL. Please add details manually.",
        variant: "destructive",
      });
    }
    
    setProcessing(false);
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !url.trim()) return;

    setLoading(true);

    const bookmarkData = {
      user_id: user.id,
      url: url.trim(),
      title: title.trim() || null,
      summary: summary.trim() || null,
      tags: tags.length > 0 ? tags : null,
      favicon_url: `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=64`
    };

    const { error } = await supabase
      .from('bookmarks')
      .insert([bookmarkData]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save bookmark",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Bookmark saved successfully",
      });
      
      // Reset form
      setUrl('');
      setTitle('');
      setSummary('');
      setTags([]);
      setTagInput('');
      setOpen(false);
      onBookmarkAdded();
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-gradient-primary hover:shadow-card-hover transition-all duration-300"
          size="lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Bookmark
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gradient-card border-0 shadow-floating">
        <DialogHeader>
          <DialogTitle className="text-xl">Add New Bookmark</DialogTitle>
          <DialogDescription>
            Save a link with automatic title and summary generation
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="url">URL *</Label>
            <div className="flex space-x-2">
              <Input
                id="url"
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="flex-1"
              />
              <Button
                type="button"
                onClick={processUrl}
                disabled={!url.trim() || processing}
                variant="outline"
                size="sm"
              >
                {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Process'}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Auto-generated or custom title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Summary</Label>
            <Textarea
              id="summary"
              placeholder="Auto-generated summary or add your own notes"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex space-x-2">
              <Input
                id="tags"
                placeholder="Add a tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} variant="outline" size="sm">
                Add
              </Button>
            </div>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="pr-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !url.trim()}
              className="bg-gradient-primary"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Save Bookmark
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBookmarkDialog;
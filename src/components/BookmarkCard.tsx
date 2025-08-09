import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, ExternalLink, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Bookmark {
  id: string;
  url: string;
  title: string | null;
  favicon_url: string | null;
  summary: string | null;
  tags: string[] | null;
  created_at: string;
}

interface BookmarkCardProps {
  bookmark: Bookmark;
  onDelete: (id: string) => void;
}

const BookmarkCard = ({ bookmark, onDelete }: BookmarkCardProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setLoading(true);
    
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', bookmark.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete bookmark",
        variant: "destructive",
      });
    } else {
      onDelete(bookmark.id);
      toast({
        title: "Success",
        description: "Bookmark deleted successfully",
      });
    }
    
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  return (
    <Card className="group bg-gradient-card border-0 shadow-card hover:shadow-card-hover transition-all duration-300 hover:scale-[1.02]">
      <CardContent className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <img
              src={bookmark.favicon_url || '/placeholder.svg'}
              alt="Favicon"
              className="w-6 h-6 rounded-sm flex-shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-foreground truncate">
                {bookmark.title || 'Untitled'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {getDomain(bookmark.url)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => window.open(bookmark.url, '_blank')}
              className="h-8 w-8 p-0 hover:bg-primary/10"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDelete}
              disabled={loading}
              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Summary */}
        {bookmark.summary && (
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {bookmark.summary}
          </p>
        )}

        {/* Tags */}
        {bookmark.tags && bookmark.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {bookmark.tags.slice(0, 3).map((tag, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs bg-primary/10 text-primary hover:bg-primary/20"
              >
                {tag}
              </Badge>
            ))}
            {bookmark.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{bookmark.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{formatDate(bookmark.created_at)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookmarkCard;
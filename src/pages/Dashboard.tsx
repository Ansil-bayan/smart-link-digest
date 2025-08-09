import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bookmark, LogOut, Search, Filter, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import BookmarkCard from '@/components/BookmarkCard';
import AddBookmarkDialog from '@/components/AddBookmarkDialog';

interface BookmarkType {
  id: string;
  url: string;
  title: string | null;
  favicon_url: string | null;
  summary: string | null;
  tags: string[] | null;
  created_at: string;
}

const Dashboard = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState<BookmarkType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const { user, signOut } = useAuth();

  const loadBookmarks = async () => {
    if (!user) return;
    
    setLoading(true);
    
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading bookmarks:', error);
    } else {
      setBookmarks(data || []);
      
      // Extract all unique tags
      const tags = new Set<string>();
      (data || []).forEach(bookmark => {
        if (bookmark.tags) {
          bookmark.tags.forEach(tag => tags.add(tag));
        }
      });
      setAllTags(Array.from(tags));
    }
    
    setLoading(false);
  };

  useEffect(() => {
    loadBookmarks();
  }, [user]);

  useEffect(() => {
    let filtered = bookmarks;

    // Filter by search term
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(bookmark => 
        bookmark.title?.toLowerCase().includes(search) ||
        bookmark.summary?.toLowerCase().includes(search) ||
        bookmark.url.toLowerCase().includes(search) ||
        bookmark.tags?.some(tag => tag.toLowerCase().includes(search))
      );
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(bookmark => 
        bookmark.tags?.some(tag => selectedTags.includes(tag))
      );
    }

    setFilteredBookmarks(filtered);
  }, [bookmarks, searchTerm, selectedTags]);

  const handleDeleteBookmark = (id: string) => {
    setBookmarks(prev => prev.filter(bookmark => bookmark.id !== id));
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTags([]);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Bookmark className="h-8 w-8 text-primary" />
                <Sparkles className="h-4 w-4 text-primary-glow absolute -top-1 -right-1" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Smart Link Digest
                </h1>
                <p className="text-sm text-muted-foreground">
                  Welcome back, {user?.email}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <AddBookmarkDialog onBookmarkAdded={loadBookmarks} />
              <Button variant="outline" onClick={signOut} size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bookmarks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50"
              />
            </div>
            {(searchTerm || selectedTags.length > 0) && (
              <Button variant="outline" onClick={clearFilters} size="sm">
                Clear Filters
              </Button>
            )}
          </div>

          {/* Tags Filter */}
          {allTags.length > 0 && (
            <div className="flex items-center space-x-2 flex-wrap">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Filter by tags:</span>
              {allTags.map(tag => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className={`cursor-pointer transition-all ${
                    selectedTags.includes(tag)
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-primary/10'
                  }`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Bookmarks Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        ) : filteredBookmarks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookmarks.map(bookmark => (
              <BookmarkCard
                key={bookmark.id}
                bookmark={bookmark}
                onDelete={handleDeleteBookmark}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto space-y-4">
              <Bookmark className="h-16 w-16 text-muted-foreground mx-auto" />
              <h3 className="text-xl font-semibold">
                {bookmarks.length === 0 ? 'No bookmarks yet' : 'No bookmarks found'}
              </h3>
              <p className="text-muted-foreground">
                {bookmarks.length === 0
                  ? 'Start saving your favorite links and let AI create summaries for you'
                  : 'Try adjusting your search or clearing filters'
                }
              </p>
              {bookmarks.length === 0 && (
                <AddBookmarkDialog onBookmarkAdded={loadBookmarks} />
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
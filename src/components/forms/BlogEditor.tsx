"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Save, ArrowLeft, Image as ImageIcon, Globe, Search, Loader2 } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';

const RichEditor = dynamic(() => import('@/components/forms/RichEditor'), { 
  ssr: false,
  loading: () => <div className="h-[600px] bg-muted animate-pulse rounded-xl" />
});

interface BlogEditorProps {
  id?: string;
  initialData?: any;
}

export default function BlogEditor({ id, initialData }: BlogEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Travel',
    excerpt: '',
    author: 'Admin',
    coverImage: '',
    status: 'published',
    meta_title: '',
    meta_description: '',
    keywords: '',
    content: initialData?.content || { blocks: [] }
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...formData,
        ...initialData,
        content: initialData.content || { blocks: [] }
      });
    }
  }, [initialData]);

  const handleSave = async () => {
    if (!formData.title || !formData.slug) {
      alert("Title and Slug are required");
      return;
    }

    setLoading(true);
    try {
      const url = id ? `/api/blogs/${id}` : '/api/blogs';
      const method = id ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' }
      });

      const result = await res.json();
      
      if (res.ok) {
        alert(id ? "Blog updated successfully!" : "Blog created successfully!");
        router.push('/blogs');
        router.refresh();
      } else {
        alert(result.error || "Failed to save blog");
      }
    } catch (error) {
      console.error("Save Error:", error);
      alert("An error occurred while saving");
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    setFormData({ ...formData, slug });
  };

  return (
    <div className="w-full max-w-7xl mx-auto pb-20 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div className="flex items-center gap-4">
          <Link href="/blogs">
            <Button variant="outline" size="icon" className="rounded-full h-9 w-9">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {id ? 'Edit Blog Post' : 'Create New Post'}
            </h1>
            <p className="text-sm text-muted-foreground">Draft and publish your stories.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Select 
            value={formData.status}
            onValueChange={(value) => setFormData({ ...formData, status: value as string })}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleSave} disabled={loading} className="gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Post
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <input 
              type="text"
              placeholder="Enter title..."
              className="w-full text-3xl font-bold border-none outline-none placeholder:text-muted-foreground/30 bg-transparent"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              onBlur={!formData.slug ? generateSlug : undefined}
            />
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-lg w-fit">
              <Globe className="w-3.5 h-3.5" />
              <span>/{formData.slug || 'slug-placeholder'}</span>
            </div>
          </div>

          <div className="pt-8 border-t">
            <RichEditor 
              initialContent={id ? JSON.stringify(formData.content) : undefined}
              onChange={(data) => setFormData({ ...formData, content: data })}
            />
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          {/* General Settings */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
              General Settings
            </div>
            <div className="space-y-4 pl-6 border-l-2 border-muted">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Category</label>
                <Input 
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g. Travel, Food"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Author</label>
                <Input 
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Cover Image</label>
                <div 
                  className={cn(
                    "relative aspect-video rounded-2xl border-2 border-dashed border-muted transition-all overflow-hidden bg-muted/5 group",
                    formData.coverImage ? "border-solid border-primary/20" : "hover:border-primary/20 hover:bg-muted/10"
                  )}
                >
                  {formData.coverImage ? (
                    <>
                      <img src={formData.coverImage} alt="Cover" className="object-cover w-full h-full" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          className="h-8 rounded-full text-[10px] font-bold uppercase tracking-wider"
                          onClick={() => document.getElementById('cover-upload')?.click()}
                        >
                          Change
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          className="h-8 rounded-full text-[10px] font-bold uppercase tracking-wider"
                          onClick={() => setFormData({ ...formData, coverImage: '' })}
                        >
                          Remove
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div 
                      className="absolute inset-0 flex flex-col items-center justify-center gap-3 cursor-pointer"
                      onClick={() => document.getElementById('cover-upload')?.click()}
                    >
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                        <ImageIcon className="h-5 w-5" />
                      </div>
                      <div className="text-center">
                        <p className="text-[11px] font-bold uppercase tracking-wider">Click to upload</p>
                        <p className="text-[9px] text-muted-foreground font-medium italic mt-0.5">Recommended: 1200 x 630px</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Hidden Input */}
                  <input 
                    type="file" 
                    id="cover-upload"
                    className="hidden" 
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      const uploadData = new FormData();
                      uploadData.append('file', file);

                      try {
                        setLoading(true);
                        const res = await fetch('/api/upload', {
                          method: 'POST',
                          body: uploadData,
                        });
                        const data = await res.json();
                        if (data.url) {
                          setFormData({ ...formData, coverImage: data.url });
                        } else {
                          alert(data.error || "Upload failed");
                        }
                      } catch (err) {
                        alert("Upload failed");
                      } finally {
                        setLoading(false);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Search className="h-4 w-4 text-muted-foreground" />
              SEO Optimization
            </div>
            <div className="space-y-4 pl-6 border-l-2 border-muted">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Meta Title</label>
                <Input 
                  value={formData.meta_title}
                  onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                  placeholder="SEO friendly title"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Meta Description</label>
                <Textarea 
                  className="min-h-[100px]"
                  value={formData.meta_description}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  placeholder="Summary for search results..."
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Keywords</label>
                <Input 
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  placeholder="travel, summer, party"
                />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

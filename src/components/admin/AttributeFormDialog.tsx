import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface AttributeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  attribute?: { id: string; name: string; slug: string; about?: string | null } | null;
  onSave: (data: { name: string; slug: string; about?: string }) => void;
  isPending?: boolean;
  showAbout?: boolean;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function AttributeFormDialog({
  open,
  onOpenChange,
  title,
  attribute,
  onSave,
  isPending,
  showAbout,
}: AttributeFormDialogProps) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [about, setAbout] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (open) {
      if (attribute) {
        setName(attribute.name);
        setSlug(attribute.slug);
        setAbout(attribute.about || '');
        setSlugTouched(true);
      } else {
        setName('');
        setSlug('');
        setAbout('');
        setSlugTouched(false);
      }
    }
  }, [open, attribute]);

  useEffect(() => {
    if (!slugTouched && name) {
      setSlug(generateSlug(name));
    }
  }, [name, slugTouched]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;
    onSave({ name: name.trim(), slug: slug.trim(), about: about.trim() || undefined });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{attribute ? `Edit ${title}` : `Add ${title}`}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={`Enter ${title.toLowerCase()} name`}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugTouched(true);
              }}
              placeholder="auto-generated-slug"
              required
            />
          </div>
          {showAbout && (
            <div className="space-y-2">
              <Label htmlFor="about">About (optional)</Label>
              <Textarea
                id="about"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Biographical information about this designer..."
                rows={4}
              />
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !name.trim() || !slug.trim()}>
              {isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

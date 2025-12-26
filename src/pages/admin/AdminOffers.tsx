import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Check, Trash2 } from 'lucide-react';

export default function AdminOffers() {
  const queryClient = useQueryClient();

  const { data: offers = [], isLoading } = useQuery({
    queryKey: ['admin-offers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('offers')
        .select('*, product:products(id, name, slug, price)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const markRead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('offers').update({ is_read: true }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-offers'] }),
  });

  const deleteOffer = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('offers').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-offers'] });
      toast.success('Offer deleted');
    },
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-4xl">Offers</h1>
          <p className="text-muted-foreground">Customer offer submissions</p>
        </div>

        <div className="border-2 border-foreground">
          <Table>
            <TableHeader>
              <TableRow className="border-foreground">
                <TableHead>Product</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="text-right">List Price</TableHead>
                <TableHead className="text-right">Offer</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-24"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8">Loading...</TableCell></TableRow>
              ) : offers.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No offers</TableCell></TableRow>
              ) : offers.map((offer) => (
                <TableRow key={offer.id} className={`border-foreground ${!offer.is_read ? 'bg-secondary' : ''}`}>
                  <TableCell className="font-medium">{offer.product?.name}</TableCell>
                  <TableCell>
                    <div>{offer.customer_name}</div>
                    <div className="text-xs text-muted-foreground">{offer.customer_email}</div>
                  </TableCell>
                  <TableCell className="text-right">${offer.product?.price?.toLocaleString() || '—'}</TableCell>
                  <TableCell className="text-right font-bold">${offer.offer_amount.toLocaleString()}</TableCell>
                  <TableCell className="max-w-xs truncate">{offer.message || '—'}</TableCell>
                  <TableCell className="text-sm">{format(new Date(offer.created_at), 'MMM d, yyyy')}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {!offer.is_read && (
                        <Button variant="ghost" size="icon" onClick={() => markRead.mutate(offer.id)}>
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => deleteOffer.mutate(offer.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}

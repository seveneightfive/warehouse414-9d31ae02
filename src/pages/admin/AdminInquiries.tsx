import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Check, Trash2 } from 'lucide-react';

export default function AdminInquiries() {
  const queryClient = useQueryClient();

  const { data: inquiries = [], isLoading } = useQuery({
    queryKey: ['admin-inquiries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('purchase_inquiries')
        .select('*, product:products(id, name, slug, price)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const markRead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('purchase_inquiries').update({ is_read: true }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-inquiries'] }),
  });

  const deleteInquiry = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('purchase_inquiries').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-inquiries'] });
      toast.success('Inquiry deleted');
    },
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-4xl">Purchase Inquiries</h1>
          <p className="text-muted-foreground">Customer purchase requests</p>
        </div>

        <div className="border-2 border-foreground">
          <Table>
            <TableHeader>
              <TableRow className="border-foreground">
                <TableHead>Product</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-24"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8">Loading...</TableCell></TableRow>
              ) : inquiries.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No inquiries</TableCell></TableRow>
              ) : inquiries.map((inquiry) => (
                <TableRow key={inquiry.id} className={`border-foreground ${!inquiry.is_read ? 'bg-secondary' : ''}`}>
                  <TableCell className="font-medium">{inquiry.product?.name}</TableCell>
                  <TableCell>{inquiry.customer_name}</TableCell>
                  <TableCell>
                    <div className="text-sm">{inquiry.customer_email}</div>
                    {inquiry.customer_phone && <div className="text-xs text-muted-foreground">{inquiry.customer_phone}</div>}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{inquiry.message || '—'}</TableCell>
                  <TableCell className="text-sm">{format(new Date(inquiry.created_at), 'MMM d, yyyy')}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {!inquiry.is_read && (
                        <Button variant="ghost" size="icon" onClick={() => markRead.mutate(inquiry.id)}>
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => deleteInquiry.mutate(inquiry.id)}>
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

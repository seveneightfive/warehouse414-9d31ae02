import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { Trash2, Clock } from 'lucide-react';

export default function AdminHolds() {
  const queryClient = useQueryClient();

  const { data: holds = [], isLoading } = useQuery({
    queryKey: ['admin-holds'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_holds')
        .select('*, product:products(id, name, slug)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const releaseHold = useMutation({
    mutationFn: async (holdId: string) => {
      const hold = holds.find(h => h.id === holdId);
      if (hold) {
        await supabase.from('products').update({ status: 'available' }).eq('id', hold.product_id);
      }
      const { error } = await supabase.from('product_holds').delete().eq('id', holdId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-holds'] });
      toast.success('Hold released');
    },
  });

  const now = new Date();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-4xl">Holds</h1>
          <p className="text-muted-foreground">Manage product holds</p>
        </div>

        <div className="border-2 border-foreground">
          <Table>
            <TableHeader>
              <TableRow className="border-foreground">
                <TableHead>Product</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8">Loading...</TableCell></TableRow>
              ) : holds.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No holds</TableCell></TableRow>
              ) : holds.map((hold) => {
                const isExpired = new Date(hold.expires_at) < now;
                return (
                  <TableRow key={hold.id} className="border-foreground">
                    <TableCell className="font-medium">{hold.product?.name}</TableCell>
                    <TableCell>{hold.customer_name}</TableCell>
                    <TableCell>
                      <div className="text-sm">{hold.customer_email}</div>
                      {hold.customer_phone && <div className="text-xs text-muted-foreground">{hold.customer_phone}</div>}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={isExpired ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                        {isExpired ? 'Expired' : 'Active'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(hold.expires_at), { addSuffix: true })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => releaseHold.mutate(hold.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}

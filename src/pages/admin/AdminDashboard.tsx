import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Clock, DollarSign, ShoppingCart, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [products, holds, offers, inquiries] = await Promise.all([
        supabase.from('products').select('id, status'),
        supabase.from('product_holds').select('id, expires_at'),
        supabase.from('offers').select('id, is_read'),
        supabase.from('purchase_inquiries').select('id, is_read'),
      ]);

      const now = new Date();
      const activeHolds = holds.data?.filter(h => new Date(h.expires_at) > now) || [];
      const unreadOffers = offers.data?.filter(o => !o.is_read) || [];
      const unreadInquiries = inquiries.data?.filter(i => !i.is_read) || [];

      return {
        totalProducts: products.data?.length || 0,
        availableProducts: products.data?.filter(p => p.status === 'available').length || 0,
        soldProducts: products.data?.filter(p => p.status === 'sold').length || 0,
        activeHolds: activeHolds.length,
        totalOffers: offers.data?.length || 0,
        unreadOffers: unreadOffers.length,
        totalInquiries: inquiries.data?.length || 0,
        unreadInquiries: unreadInquiries.length,
      };
    },
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-4xl">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to Warehouse414 Admin</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link to="/admin/products">
            <Card className="border-2 border-foreground hover:bg-secondary transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-display">{stats?.totalProducts || 0}</div>
                <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    {stats?.availableProducts || 0} available
                  </span>
                  <span>{stats?.soldProducts || 0} sold</span>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/holds">
            <Card className="border-2 border-foreground hover:bg-secondary transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Holds</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-display">{stats?.activeHolds || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Currently held products
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/offers">
            <Card className="border-2 border-foreground hover:bg-secondary transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Offers</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-display">{stats?.totalOffers || 0}</div>
                {stats?.unreadOffers ? (
                  <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {stats.unreadOffers} unread
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground mt-1">All caught up</p>
                )}
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/inquiries">
            <Card className="border-2 border-foreground hover:bg-secondary transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Purchase Inquiries</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-display">{stats?.totalInquiries || 0}</div>
                {stats?.unreadInquiries ? (
                  <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {stats.unreadInquiries} unread
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground mt-1">All caught up</p>
                )}
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}

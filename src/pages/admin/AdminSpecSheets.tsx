import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { FileText, Check, X } from "lucide-react";
import { Link } from "react-router-dom";

interface SpecSheetDownload {
  id: string;
  product_id: string;
  customer_name: string;
  customer_email: string;
  include_price: boolean;
  created_at: string;
  products: {
    name: string;
    slug: string;
  } | null;
}

const AdminSpecSheets = () => {
  const { data: downloads, isLoading } = useQuery({
    queryKey: ["spec-sheet-downloads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("spec_sheet_downloads")
        .select(`
          *,
          products (name, slug)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as SpecSheetDownload[];
    },
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl">Spec Sheet Downloads</h1>
            <p className="text-muted-foreground font-body">
              Track who has downloaded product spec sheets
            </p>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <span className="font-body text-sm text-muted-foreground">
              {downloads?.length || 0} total downloads
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12 font-body text-muted-foreground">
            Loading downloads...
          </div>
        ) : downloads && downloads.length > 0 ? (
          <div className="border-2 border-foreground">
            <Table>
              <TableHeader>
                <TableRow className="border-b-2 border-foreground">
                  <TableHead className="font-display text-xs tracking-widest">
                    DATE
                  </TableHead>
                  <TableHead className="font-display text-xs tracking-widest">
                    PRODUCT
                  </TableHead>
                  <TableHead className="font-display text-xs tracking-widest">
                    NAME
                  </TableHead>
                  <TableHead className="font-display text-xs tracking-widest">
                    EMAIL
                  </TableHead>
                  <TableHead className="font-display text-xs tracking-widest text-center">
                    INCLUDED PRICE
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {downloads.map((download) => (
                  <TableRow
                    key={download.id}
                    className="border-b border-border"
                  >
                    <TableCell className="font-body text-sm">
                      {format(new Date(download.created_at), "MMM d, yyyy h:mm a")}
                    </TableCell>
                    <TableCell className="font-body">
                      {download.products ? (
                        <Link
                          to={`/product/${download.products.slug}`}
                          className="hover:underline text-primary"
                        >
                          {download.products.name}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">
                          Product deleted
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="font-body">
                      {download.customer_name}
                    </TableCell>
                    <TableCell className="font-body">
                      <a
                        href={`mailto:${download.customer_email}`}
                        className="hover:underline text-primary"
                      >
                        {download.customer_email}
                      </a>
                    </TableCell>
                    <TableCell className="text-center">
                      {download.include_price ? (
                        <Badge variant="outline" className="gap-1">
                          <Check className="h-3 w-3" />
                          Yes
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1">
                          <X className="h-3 w-3" />
                          No
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-border">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="font-body text-muted-foreground">
              No spec sheet downloads yet
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminSpecSheets;

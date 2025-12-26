import React, { useRef, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, CheckCircle, XCircle, Loader2, FileText, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';


interface TableConfig {
  name: string;
  tableName: string;
  description: string;
  expectedRows: number;
}

const TABLES: TableConfig[] = [
  { name: 'Team Users', tableName: 'team_users', description: 'Admin and team members', expectedRows: 68 },
  { name: 'Planners', tableName: 'planners', description: 'Event planners/vendors', expectedRows: 10486 },
  { name: 'General Leads', tableName: 'general_leads', description: 'Main leads data', expectedRows: 68032 },
  { name: 'Custom Buy Leads', tableName: 'custom_buyleads', description: 'Custom buy leads', expectedRows: 54110 },
  { name: 'Chat Lead Form', tableName: 'chat_leadform', description: 'Chat enquiry leads', expectedRows: 147747 },
  { name: 'Lead Purchases', tableName: 'general_leads_buy', description: 'Lead purchase records', expectedRows: 11272 },
  { name: 'Client Subscriptions', tableName: 'client_subscriptions', description: 'Client subscription data', expectedRows: 126 },
  { name: 'Planner Subscriptions', tableName: 'planner_subscriptions', description: 'Planner subscription data', expectedRows: 1266 },
  { name: 'App Links', tableName: 'app_links', description: 'App download requests', expectedRows: 83 },
];

interface ImportStatus {
  tableName: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  success?: number;
  failed?: number;
  errors?: string[];
}

const DataImportPage: React.FC = () => {
  const [importStatuses, setImportStatuses] = useState<Record<string, ImportStatus>>({});
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleFileSelect = async (tableName: string, file: File) => {
    setImportStatuses(prev => ({
      ...prev,
      [tableName]: { tableName, status: 'uploading' }
    }));

    try {
      const csvContent = await file.text();
      
      const { data, error } = await supabase.functions.invoke('import-csv', {
        body: { table: tableName, csvContent, batchSize: 500 }
      });

      if (error) throw error;

      setImportStatuses(prev => ({
        ...prev,
        [tableName]: {
          tableName,
          status: data.failed === 0 ? 'success' : 'error',
          success: data.success,
          failed: data.failed,
          errors: data.errors
        }
      }));

      if (data.failed === 0) {
        toast.success(`Imported ${data.success} records to ${tableName}`);
      } else {
        toast.warning(`Imported ${data.success} records, ${data.failed} failed`);
      }
    } catch (error) {
      console.error('Import error:', error);
      setImportStatuses(prev => ({
        ...prev,
        [tableName]: {
          tableName,
          status: 'error',
          errors: [error instanceof Error ? error.message : 'Import failed']
        }
      }));
      toast.error(`Failed to import ${tableName}`);
    }
  };

  const getStatusIcon = (status?: ImportStatus) => {
    if (!status) return <FileText className="h-5 w-5 text-muted-foreground" />;
    
    switch (status.status) {
      case 'uploading':
        return <Loader2 className="h-5 w-5 text-primary animate-spin" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return <FileText className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status?: ImportStatus) => {
    if (!status) return <Badge variant="outline">Pending</Badge>;
    
    switch (status.status) {
      case 'uploading':
        return <Badge variant="secondary">Uploading...</Badge>;
      case 'success':
        return <Badge className="bg-green-500">{status.success} imported</Badge>;
      case 'error':
        return (
          <Badge variant="destructive">
            {status.success || 0} ok, {status.failed || 0} failed
          </Badge>
        );
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <AppLayout>
      <Header title="Data Import" subtitle="Import CSV data into database tables" />
      
      <div className="p-6">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              CSV Data Import
            </CardTitle>
            <CardDescription>
              Upload your CSV files to import data into the database. Each file should match the expected format for its table.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg mb-4">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Large files may take several minutes to import. Please be patient and don't close the page.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {TABLES.map((table) => {
            const status = importStatuses[table.tableName];
            const isUploading = status?.status === 'uploading';

            return (
              <Card key={table.tableName}>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(status)}
                      <div>
                        <h3 className="font-medium">{table.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {table.description} • Expected: ~{table.expectedRows.toLocaleString()} rows
                        </p>
                        {status?.errors && status.errors.length > 0 && (
                          <p className="text-xs text-destructive mt-1">
                            {status.errors[0]}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(status)}
                      <input
                        type="file"
                        accept=".csv"
                        className="hidden"
                        ref={(el) => fileInputRefs.current[table.tableName] = el}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileSelect(table.tableName, file);
                        }}
                        disabled={isUploading}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRefs.current[table.tableName]?.click()}
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Importing...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload CSV
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>CSV File Mapping</CardTitle>
            <CardDescription>
              Make sure your CSV files match the expected filenames
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><strong>usersteam.csv</strong> → Team Users</div>
              <div><strong>usersplanners.csv</strong> → Planners</div>
              <div><strong>general_leads.csv</strong> → General Leads</div>
              <div><strong>custom_buyleads.csv</strong> → Custom Buy Leads</div>
              <div><strong>chat_leadform.csv</strong> → Chat Lead Form</div>
              <div><strong>general_leads_buy.csv</strong> → Lead Purchases</div>
              <div><strong>client_subscription.csv</strong> → Client Subscriptions</div>
              <div><strong>planners_subscription.csv</strong> → Planner Subscriptions</div>
              <div><strong>applinks.csv</strong> → App Links</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default DataImportPage;

import React, { useRef, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, CheckCircle, XCircle, Loader2, FileText, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';


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
  progress?: number;
  totalChunks?: number;
  currentChunk?: number;
}

// Split CSV into chunks while preserving the header
function splitCSVIntoChunks(csvContent: string, chunkSize: number = 5000): string[] {
  const lines = csvContent.split('\n');
  if (lines.length <= 1) return [csvContent];
  
  const header = lines[0];
  const dataLines = lines.slice(1).filter(line => line.trim());
  const chunks: string[] = [];
  
  for (let i = 0; i < dataLines.length; i += chunkSize) {
    const chunkLines = dataLines.slice(i, i + chunkSize);
    chunks.push(header + '\n' + chunkLines.join('\n'));
  }
  
  return chunks;
}

const DataImportPage: React.FC = () => {
  const [importStatuses, setImportStatuses] = useState<Record<string, ImportStatus>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleFileSelect = async (tableName: string, file: File) => {
    setImportStatuses(prev => ({
      ...prev,
      [tableName]: { tableName, status: 'uploading', progress: 0 }
    }));

    try {
      const csvContent = await file.text();
      
      // Split into chunks for large files
      const chunks = splitCSVIntoChunks(csvContent, 5000);
      const totalChunks = chunks.length;
      
      let totalSuccess = 0;
      let totalFailed = 0;
      const allErrors: string[] = [];
      
      console.log(`Starting import for ${tableName} with ${totalChunks} chunks`);
      
      for (let i = 0; i < chunks.length; i++) {
        setImportStatuses(prev => ({
          ...prev,
          [tableName]: { 
            tableName, 
            status: 'uploading', 
            progress: Math.round((i / totalChunks) * 100),
            totalChunks,
            currentChunk: i + 1,
            success: totalSuccess,
            failed: totalFailed
          }
        }));
        
        const { data, error } = await supabase.functions.invoke('import-csv', {
          body: { table: tableName, csvContent: chunks[i], batchSize: 100 }
        });

        if (error) {
          console.error(`Chunk ${i + 1} error:`, error);
          allErrors.push(`Chunk ${i + 1}: ${error.message}`);
          // Continue with next chunk instead of failing completely
          continue;
        }

        totalSuccess += data.success || 0;
        totalFailed += data.failed || 0;
        
        if (data.errors && data.errors.length > 0) {
          allErrors.push(...data.errors.slice(0, 3));
        }
        
        console.log(`Chunk ${i + 1}/${totalChunks} complete: ${data.success} success, ${data.failed} failed`);
      }

      const finalStatus: ImportStatus = {
        tableName,
        status: totalFailed === 0 && allErrors.length === 0 ? 'success' : 'error',
        success: totalSuccess,
        failed: totalFailed,
        errors: allErrors.slice(0, 5),
        progress: 100
      };
      
      setImportStatuses(prev => ({
        ...prev,
        [tableName]: finalStatus
      }));

      if (totalFailed === 0 && allErrors.length === 0) {
        toast.success(`Imported ${totalSuccess.toLocaleString()} records to ${tableName}`);
      } else {
        toast.warning(`Imported ${totalSuccess.toLocaleString()} records, ${totalFailed.toLocaleString()} failed`);
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
        return (
          <Badge variant="secondary">
            Chunk {status.currentChunk || 1}/{status.totalChunks || 1} ({status.progress || 0}%)
          </Badge>
        );
      case 'success':
        return <Badge className="bg-green-500">{(status.success || 0).toLocaleString()} imported</Badge>;
      case 'error':
        return (
          <Badge variant="destructive">
            {(status.success || 0).toLocaleString()} ok, {(status.failed || 0).toLocaleString()} failed
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
              Upload your CSV files to import data into the database. Large files are automatically chunked for reliable import.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg mb-4">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Large files are split into chunks of 5,000 rows each for reliable import. Progress is tracked per chunk.
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
                      <div className="flex-1">
                        <h3 className="font-medium">{table.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {table.description} • Expected: ~{table.expectedRows.toLocaleString()} rows
                        </p>
                        {status?.status === 'uploading' && status.success !== undefined && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {status.success.toLocaleString()} imported so far...
                          </p>
                        )}
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
                        ref={(el) => { fileInputRefs.current[table.tableName] = el; }}
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
                  {status?.status === 'uploading' && (
                    <Progress value={status.progress || 0} className="mt-3 h-2" />
                  )}
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

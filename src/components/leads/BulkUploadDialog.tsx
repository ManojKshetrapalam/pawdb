import { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Lead, VERTICALS, Vertical, LeadSource } from '@/types';
import { mockUsers } from '@/data/mockData';
import { Upload, FileSpreadsheet, Download, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';

interface BulkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (leads: Partial<Lead>[]) => void;
}

interface ParsedLead {
  name: string;
  email: string;
  phone: string;
  vertical: string;
  source: string;
  isValid: boolean;
  errors: string[];
}

export function BulkUploadDialog({ open, onOpenChange, onUpload }: BulkUploadDialogProps) {
  const [step, setStep] = useState<'upload' | 'preview'>('upload');
  const [parsedLeads, setParsedLeads] = useState<ParsedLead[]>([]);
  const [defaultVertical, setDefaultVertical] = useState<Vertical>('app-b2b');
  const [defaultSource, setDefaultSource] = useState<LeadSource>('meta');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validVerticals = VERTICALS.map(v => v.id);
  const validSources: LeadSource[] = ['meta', 'google', 'organic', 'referral'];

  const validateLead = (lead: Partial<ParsedLead>): ParsedLead => {
    const errors: string[] = [];
    
    if (!lead.name?.trim()) errors.push('Name required');
    if (!lead.phone?.trim()) errors.push('Phone required');
    
    const vertical = lead.vertical?.toLowerCase().replace(/\s+/g, '-') || '';
    const isValidVertical = validVerticals.includes(vertical as Vertical);
    
    const source = lead.source?.toLowerCase() || '';
    const isValidSource = validSources.includes(source as LeadSource);

    return {
      name: lead.name?.trim() || '',
      email: lead.email?.trim() || '',
      phone: lead.phone?.trim() || '',
      vertical: isValidVertical ? vertical : '',
      source: isValidSource ? source : '',
      isValid: errors.length === 0,
      errors,
    };
  };

  const parseCSV = (text: string): ParsedLead[] => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const nameIdx = headers.findIndex(h => h.includes('name'));
    const emailIdx = headers.findIndex(h => h.includes('email'));
    const phoneIdx = headers.findIndex(h => h.includes('phone') || h.includes('mobile'));
    const verticalIdx = headers.findIndex(h => h.includes('vertical') || h.includes('category'));
    const sourceIdx = headers.findIndex(h => h.includes('source'));

    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
      
      return validateLead({
        name: nameIdx >= 0 ? values[nameIdx] : '',
        email: emailIdx >= 0 ? values[emailIdx] : '',
        phone: phoneIdx >= 0 ? values[phoneIdx] : '',
        vertical: verticalIdx >= 0 ? values[verticalIdx] : '',
        source: sourceIdx >= 0 ? values[sourceIdx] : '',
      });
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const leads = parseCSV(text);
      
      if (leads.length === 0) {
        toast.error('No valid leads found in the file');
        return;
      }

      setParsedLeads(leads);
      setStep('preview');
    };
    reader.readAsText(file);
  };

  const handleUpload = () => {
    const validLeads = parsedLeads.filter(l => l.isValid);
    
    const leadsToUpload: Partial<Lead>[] = validLeads.map(lead => ({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      vertical: (lead.vertical || defaultVertical) as Vertical,
      source: (lead.source || defaultSource) as LeadSource,
      status: 'new' as const,
    }));

    onUpload(leadsToUpload);
    toast.success(`${leadsToUpload.length} leads uploaded successfully!`);
    handleClose();
  };

  const handleClose = () => {
    setStep('upload');
    setParsedLeads([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onOpenChange(false);
  };

  const downloadTemplate = () => {
    const verticalsList = VERTICALS.map(v => v.id).join(', ');
    const employeesList = mockUsers.map(u => `${u.name} (${u.role})`).join(', ');
    
    const template = `Name,Email,Phone,Vertical,Source
John Doe,john@example.com,9876543210,app-b2b,meta
Jane Smith,jane@example.com,9876543211,buy-leads,google

--- REFERENCE (Delete this section before uploading) ---

VERTICALS (use exactly as shown):
${verticalsList}

SOURCES (use exactly as shown):
meta, google, organic, referral

EMPLOYEES:
${employeesList}`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const validCount = parsedLeads.filter(l => l.isValid).length;
  const invalidCount = parsedLeads.length - validCount;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Bulk Upload Leads</DialogTitle>
          <DialogDescription>
            {step === 'upload' 
              ? 'Upload a CSV file with your leads data' 
              : `Preview ${parsedLeads.length} leads before uploading`}
          </DialogDescription>
        </DialogHeader>

        {step === 'upload' ? (
          <div className="space-y-6">
            {/* File Upload Area */}
            <div 
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">CSV files only</p>
              <Input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Default Values */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Default Vertical (if not in file)</Label>
                <Select value={defaultVertical} onValueChange={(v) => setDefaultVertical(v as Vertical)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VERTICALS.map((v) => (
                      <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Default Source (if not in file)</Label>
                <Select value={defaultSource} onValueChange={(v) => setDefaultSource(v as LeadSource)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meta">Meta</SelectItem>
                    <SelectItem value="google">Google</SelectItem>
                    <SelectItem value="organic">Organic</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Download Template */}
            <Button variant="outline" onClick={downloadTemplate} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download CSV Template
            </Button>

            {/* Format Info */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <FileSpreadsheet className="h-4 w-4" />
                Expected CSV Format
              </div>
              <p className="text-xs text-muted-foreground">
                Columns: Name, Email, Phone, Vertical (optional), Source (optional)
              </p>
              <p className="text-xs text-muted-foreground">
                Verticals: app-b2b, app-b2c, buy-leads, wedding-course, wedding-sip, honeymoon, hospitality
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Summary */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>{validCount} valid</span>
              </div>
              {invalidCount > 0 && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>{invalidCount} with errors</span>
                </div>
              )}
            </div>

            {/* Preview Table */}
            <ScrollArea className="h-[300px] border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8"></TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Vertical</TableHead>
                    <TableHead>Source</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsedLeads.map((lead, idx) => (
                    <TableRow key={idx} className={!lead.isValid ? 'bg-destructive/10' : ''}>
                      <TableCell>
                        {lead.isValid ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-destructive" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{lead.name || '-'}</TableCell>
                      <TableCell>{lead.phone || '-'}</TableCell>
                      <TableCell>{lead.email || '-'}</TableCell>
                      <TableCell>{lead.vertical || `(${defaultVertical})`}</TableCell>
                      <TableCell>{lead.source || `(${defaultSource})`}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        )}

        <DialogFooter>
          {step === 'preview' && (
            <Button variant="outline" onClick={() => setStep('upload')}>
              Back
            </Button>
          )}
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          {step === 'preview' && validCount > 0 && (
            <Button onClick={handleUpload}>
              Upload {validCount} Leads
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

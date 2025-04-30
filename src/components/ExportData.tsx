
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface ExportDataProps {
  data: any[];
  filename?: string;
}

export const ExportData = ({ data, filename = "finance-data" }: ExportDataProps) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const exportToCSV = () => {
    try {
      setIsExporting(true);
      
      // Convert data to CSV format
      const headers = Object.keys(data[0]).join(",");
      const rows = data.map(item => 
        Object.values(item).map(value => 
          typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
        ).join(",")
      ).join("\n");
      
      const csvContent = `${headers}\n${rows}`;
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      // Create download link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export Successful",
        description: "Your data has been exported as CSV",
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "There was an error exporting your data",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPDF = async (elementId: string) => {
    try {
      setIsExporting(true);
      const element = document.getElementById(elementId);
      
      if (!element) {
        toast({
          variant: "destructive",
          title: "Export Failed",
          description: "Could not find the content to export",
        });
        return;
      }
      
      const canvas = await html2canvas(element, { scale: 2 });
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      
      // Calculate dimensions to fit PDF
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Add new pages if content overflows
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`${filename}-${new Date().toISOString().split('T')[0]}.pdf`);
      
      toast({
        title: "Export Successful",
        description: "Your data has been exported as PDF",
      });
    } catch (error) {
      console.error("PDF export error:", error);
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "There was an error exporting your data as PDF",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="p-4 flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold">Export Data</h3>
        <p className="text-sm text-muted-foreground">Download your financial data in different formats</p>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button disabled={isExporting}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={exportToCSV}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export as CSV
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => exportToPDF('dashboard-content')}>
            <FileText className="mr-2 h-4 w-4" />
            Export as PDF
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Card>
  );
};

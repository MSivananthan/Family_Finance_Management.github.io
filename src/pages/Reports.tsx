
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

const generateMonthlyData = () => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  return months.map(month => ({
    month,
    income: Math.floor(Math.random() * 30000) + 20000, // Random income between 20k-50k
    expenses: Math.floor(Math.random() * 20000) + 10000, // Random expenses between 10k-30k
  }));
};

const Reports = () => {
  const { toast } = useToast();
  const [data, setData] = useState(generateMonthlyData());
  const [selectedPeriod, setSelectedPeriod] = useState("12months");
  const [filterType, setFilterType] = useState<"all" | "income" | "expenses">("all");
  const [downloadFilterType, setDownloadFilterType] = useState<"all" | "income" | "expenses">("all");
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);

  useEffect(() => {
    console.log("Fetching updated financial data");
    setData(generateMonthlyData());
  }, []);

  const pieData = [
    { name: 'Housing', value: 15000 },
    { name: 'Transportation', value: 8000 },
    { name: 'Food', value: 12000 },
    { name: 'Entertainment', value: 5000 },
    { name: 'Healthcare', value: 10000 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const getFilteredData = (type: "all" | "income" | "expenses") => {
    switch (type) {
      case "income":
        return data.filter(item => item.income > 0);
      case "expenses":
        return data.filter(item => item.expenses > 0);
      default:
        return data;
    }
  };

  const handleDownloadPDF = async () => {
    // Close the download options panel
    setShowDownloadOptions(false);
    
    const element = document.getElementById('report-content');
    if (!element) return;

    try {
      // Set the filter type for display before capturing
      const originalFilterType = filterType;
      setFilterType(downloadFilterType);
      
      // Wait for the state update and re-render to complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 10;
      let pageNumber = 1;
      
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = 10;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position - (pageHeight * pageNumber), imgWidth, imgHeight);
        heightLeft -= pageHeight;
        pageNumber++;
      }
      
      const filename = `financial-report-${downloadFilterType}.pdf`;
      pdf.save(filename);
      
      // Restore the original filter type
      setFilterType(originalFilterType);

      toast({
        title: "Success",
        description: `Report downloaded successfully with ${downloadFilterType === "all" ? "all data" : downloadFilterType === "income" ? "income only" : "expenses only"} filter`,
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to download report",
        variant: "destructive",
      });
    }
  };

  const toggleDownloadOptions = () => {
    setShowDownloadOptions(!showDownloadOptions);
    setDownloadFilterType(filterType); // Initialize with current filter
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Reports</h1>
            <p className="text-muted-foreground">Analyze your financial data</p>
          </div>
          <div className="flex gap-4 items-center">
            <Select value={filterType} onValueChange={(value: "all" | "income" | "expenses") => setFilterType(value)}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transactions</SelectItem>
                <SelectItem value="income">Income Only</SelectItem>
                <SelectItem value="expenses">Expenses Only</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="relative">
              <Button onClick={toggleDownloadOptions}>
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </Button>
              
              {showDownloadOptions && (
                <Card className="absolute right-0 top-12 z-10 p-4 w-[250px] space-y-4">
                  <h4 className="font-medium">Download Options</h4>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Filter data for download:</p>
                    <Select value={downloadFilterType} onValueChange={(value: "all" | "income" | "expenses") => setDownloadFilterType(value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select filter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Transactions</SelectItem>
                        <SelectItem value="income">Income Only</SelectItem>
                        <SelectItem value="expenses">Expenses Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => setShowDownloadOptions(false)}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleDownloadPDF}>
                      Download
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>

        <div id="report-content" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Income vs Expenses ({filterType === "all" ? "All" : filterType === "income" ? "Income" : "Expenses"})</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getFilteredData(filterType)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => `₹${value.toLocaleString()}`}
                  />
                  <Legend />
                  <Bar dataKey="income" fill="#4ade80" name="Income" />
                  <Bar dataKey="expenses" fill="#f87171" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Expense Distribution</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Top Expense Categories</h3>
              <div className="space-y-4">
                {pieData.map((category) => (
                  <div key={category.name} className="flex justify-between items-center">
                    <span>{category.name}</span>
                    <span className="font-medium">₹{category.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total Income</span>
                  <span className="font-medium text-green-500">
                    ₹{data.reduce((sum, item) => sum + item.income, 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Total Expenses</span>
                  <span className="font-medium text-red-500">
                    ₹{data.reduce((sum, item) => sum + item.expenses, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Reports;

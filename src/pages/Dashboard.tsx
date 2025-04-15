import { Card } from "@/components/ui/card";
import { AppLayout } from "@/components/AppLayout";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, DollarSign, CreditCard, PiggyBank, TrendingUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useMemo } from "react";

// Sample transaction data for all 12 months
const transactionData = [
  { month: 'Jan', income: 40000, expenses: 24000, savings: 5000, investments: 8000 },
  { month: 'Feb', income: 30000, expenses: 13980, savings: 6000, investments: 8500 },
  { month: 'Mar', income: 50000, expenses: 38000, savings: 4500, investments: 9000 },
  { month: 'Apr', income: 27800, expenses: 19080, savings: 5500, investments: 8800 },
  { month: 'May', income: 38900, expenses: 28000, savings: 5200, investments: 9200 },
  { month: 'Jun', income: 43900, expenses: 28000, savings: 6500, investments: 9500 },
  { month: 'Jul', income: 45000, expenses: 30000, savings: 7000, investments: 9800 },
  { month: 'Aug', income: 42000, expenses: 27000, savings: 6800, investments: 10000 },
  { month: 'Sep', income: 41000, expenses: 26000, savings: 6900, investments: 10200 },
  { month: 'Oct', income: 44000, expenses: 29000, savings: 7100, investments: 10500 },
  { month: 'Nov', income: 46000, expenses: 31000, savings: 7300, investments: 10800 },
  { month: 'Dec', income: 48000, expenses: 32000, savings: 7500, investments: 11000 }
];

const months = ['All', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState('All');

  const filteredData = useMemo(() => {
    if (selectedMonth === 'All') return transactionData;
    return transactionData.filter(item => item.month === selectedMonth);
  }, [selectedMonth]);

  const currentMonthData = useMemo(() => {
    if (selectedMonth === 'All') {
      // Calculate averages for 'All' selection
      const totalMonths = transactionData.length;
      return {
        income: transactionData.reduce((sum, item) => sum + item.income, 0) / totalMonths,
        expenses: transactionData.reduce((sum, item) => sum + item.expenses, 0) / totalMonths,
        savings: transactionData.reduce((sum, item) => sum + item.savings, 0) / totalMonths,
        investments: transactionData.reduce((sum, item) => sum + item.investments, 0) / totalMonths,
      };
    }
    // Return data for specific month
    return transactionData.find(item => item.month === selectedMonth) || transactionData[0];
  }, [selectedMonth]);

  const stats = [
    {
      title: "Total Balance",
      value: `₹${(currentMonthData.income - currentMonthData.expenses).toLocaleString()}`,
      change: "+12%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Monthly Spending",
      value: `₹${currentMonthData.expenses.toLocaleString()}`,
      change: "-8%",
      trend: "down",
      icon: CreditCard,
    },
    {
      title: "Savings Goal",
      value: `₹${currentMonthData.savings.toLocaleString()}`,
      change: "+25%",
      trend: "up",
      icon: PiggyBank,
    },
    {
      title: "Investments",
      value: `₹${currentMonthData.investments.toLocaleString()}`,
      change: "+18%",
      trend: "up",
      icon: TrendingUp,
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's your financial overview.</p>
          </div>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const isPositive = stat.trend === "up";
            const Arrow = isPositive ? ArrowUpRight : ArrowDownRight;
            const trendColor = isPositive ? "text-green-500" : "text-red-500";

            return (
              <Card key={stat.title} className="p-6">
                <div className="flex items-center justify-between">
                  <Icon className="w-5 h-5 text-muted-foreground" />
                  <div className={`flex items-center ${trendColor}`}>
                    <span className="text-sm font-medium">{stat.change}</span>
                    <Arrow className="w-4 h-4 ml-1" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-muted-foreground">{stat.title}</h3>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </Card>
            );
          })}
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Overview</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Income"
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="hsl(var(--destructive))" 
                  strokeWidth={2}
                  name="Expenses"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
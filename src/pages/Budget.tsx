import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface Category {
  id: number;
  name: string;
  budget: number;
  spent: number;
  color: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const initialCategories = [
  {
    id: 1,
    name: "Housing",
    budget: 2000,
    spent: 1800,
    color: "#0088FE"
  },
  {
    id: 2,
    name: "Food & Dining",
    budget: 800,
    spent: 650,
    color: "#00C49F"
  },
  {
    id: 3,
    name: "Transportation",
    budget: 400,
    spent: 380,
    color: "#FFBB28"
  },
  {
    id: 4,
    name: "Entertainment",
    budget: 300,
    spent: 250,
    color: "#FF8042"
  },
  {
    id: 5,
    name: "Healthcare",
    budget: 500,
    spent: 200,
    color: "#8884d8"
  }
];

const Budget = () => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState({ name: "", budget: "" });
  const { toast } = useToast();

  const totalBudget = categories.reduce((sum, cat) => sum + cat.budget, 0);
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
  const remainingBudget = totalBudget - totalSpent;

  const pieChartData = categories.map(cat => ({
    name: cat.name,
    value: cat.spent,
    color: cat.color
  }));

  const handleAddCategory = () => {
    if (!newCategory.name || !newCategory.budget) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const newCat: Category = {
      id: categories.length + 1,
      name: newCategory.name,
      budget: Number(newCategory.budget),
      spent: 0,
      color: COLORS[categories.length % COLORS.length],
    };

    setCategories([...categories, newCat]);
    setNewCategory({ name: "", budget: "" });
    toast({
      title: "Success",
      description: "Category added successfully",
    });
  };

  const handleUpdateCategory = () => {
    if (!editingCategory) return;

    setCategories(categories.map(cat => 
      cat.id === editingCategory.id ? editingCategory : cat
    ));
    setEditingCategory(null);
    toast({
      title: "Success",
      description: "Category updated successfully",
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Budget</h1>
            <p className="text-muted-foreground">Manage your monthly budget</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Budget Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label>Category Name</label>
                  <Input
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    placeholder="Enter category name"
                  />
                </div>
                <div className="space-y-2">
                  <label>Budget Amount (₹)</label>
                  <Input
                    type="number"
                    value={newCategory.budget}
                    onChange={(e) => setNewCategory({ ...newCategory, budget: e.target.value })}
                    placeholder="Enter budget amount"
                  />
                </div>
                <Button className="w-full" onClick={handleAddCategory}>
                  Add Category
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground">Total Budget</h3>
            <p className="text-2xl font-bold">₹{totalBudget.toLocaleString()}</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground">Total Spent</h3>
            <p className="text-2xl font-bold text-orange-500">₹{totalSpent.toLocaleString()}</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground">Remaining</h3>
            <p className={`text-2xl font-bold ${remainingBudget < 0 ? 'text-red-500' : 'text-green-500'}`}>
              ₹{remainingBudget.toLocaleString()}
            </p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Spending Distribution</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Budget Categories</h3>
            <div className="space-y-6">
              {categories.map((category) => {
                const percentage = (category.spent / category.budget) * 100;
                const isOverBudget = percentage > 100;
                return (
                  <div key={category.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium flex items-center gap-2">
                          {category.name}
                          {isOverBudget && (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          )}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          ₹{category.spent.toLocaleString()} of ₹{category.budget.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-sm font-medium ${isOverBudget ? 'text-red-500' : ''}`}>
                          {percentage.toFixed(1)}%
                        </span>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Budget Category</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <label>Category Name</label>
                                <Input
                                  value={editingCategory?.name || category.name}
                                  onChange={(e) => setEditingCategory({
                                    ...category,
                                    name: e.target.value
                                  })}
                                />
                              </div>
                              <div className="space-y-2">
                                <label>Budget Amount (₹)</label>
                                <Input
                                  type="number"
                                  value={editingCategory?.budget || category.budget}
                                  onChange={(e) => setEditingCategory({
                                    ...category,
                                    budget: Number(e.target.value)
                                  })}
                                />
                              </div>
                              <Button className="w-full" onClick={handleUpdateCategory}>
                                Update Category
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                    <Progress
                      value={Math.min(percentage, 100)}
                      className={`h-2 ${isOverBudget ? 'bg-red-200' : ''}`}
                      indicatorClassName={isOverBudget ? 'bg-red-500' : undefined}
                    />
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Budget;
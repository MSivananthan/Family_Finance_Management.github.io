
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpRight, ArrowDownRight, Plus, Edit, Trash } from "lucide-react";
import { EditTransactionDialog } from "@/components/transactions/EditTransactionDialog";
import { useToast } from "@/components/ui/use-toast";
import { 
  createTransaction, 
  getTransactionsByUserId, 
  updateTransaction, 
  deleteTransaction 
} from "@/lib/mysql";
import { useAuth } from "@/hooks/useAuth";

interface Transaction {
  id: number;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  user_id?: number;
}

const fallbackTransactions: Transaction[] = [
  {
    id: 1,
    date: "2024-02-20",
    description: "Grocery Shopping",
    category: "Food",
    amount: -120.50,
    type: "expense"
  },
  {
    id: 2,
    date: "2024-02-19",
    description: "Salary Deposit",
    category: "Income",
    amount: 3000.00,
    type: "income"
  },
];

const categories = [
  "Food",
  "Transportation",
  "Utilities",
  "Entertainment",
  "Income",
  "Other"
];

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  const [newTransaction, setNewTransaction] = useState({
    description: "",
    amount: "",
    category: "",
    type: "expense" as "income" | "expense",
  });

  // Load transactions from database
  useEffect(() => {
    const loadTransactions = async () => {
      setIsLoading(true);
      try {
        if (user?.id) {
          const userTransactions = await getTransactionsByUserId(user.id);
          console.log("Loaded transactions:", userTransactions);
          
          if (userTransactions && userTransactions.length > 0) {
            setTransactions(userTransactions.map(t => ({
              ...t,
              date: t.date instanceof Date ? t.date.toISOString().split('T')[0] : t.date
            })));
          } else {
            // If no transactions found, use fallback data
            console.log("No transactions found, using fallback data");
            setTransactions(fallbackTransactions);
          }
        } else {
          // Not logged in, use fallback data
          console.log("User not logged in, using fallback data");
          setTransactions(fallbackTransactions);
        }
      } catch (error) {
        console.error("Error loading transactions:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load transactions",
        });
        setTransactions(fallbackTransactions);
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, [user, toast]);

  const handleAddTransaction = async () => {
    try {
      const amount = Number(newTransaction.amount);
      
      if (!newTransaction.description || !amount || !newTransaction.category) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please fill all required fields",
        });
        return;
      }
      
      const finalAmount = newTransaction.type === "expense" 
        ? -Math.abs(amount)
        : Math.abs(amount);
        
      let savedTransaction;
      
      if (user?.id) {
        // Save to database if logged in
        savedTransaction = await createTransaction(
          user.id,
          finalAmount,
          newTransaction.type,
          newTransaction.category,
          newTransaction.description,
          new Date()
        );
        
        console.log("Transaction saved to database:", savedTransaction);
      } else {
        // Demo mode - just create a transaction object
        savedTransaction = {
          id: transactions.length + 1,
          date: new Date().toISOString().split('T')[0],
          description: newTransaction.description,
          category: newTransaction.category,
          amount: finalAmount,
          type: newTransaction.type,
        };
      }

      setTransactions([savedTransaction, ...transactions]);
      setIsAddingTransaction(false);
      setNewTransaction({
        description: "",
        amount: "",
        category: "",
        type: "expense",
      });
      
      toast({
        title: "Success",
        description: "Transaction added successfully",
      });
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add transaction",
      });
    }
  };

  const handleUpdateTransaction = async (updatedTransaction: Transaction) => {
    try {
      if (user?.id && updatedTransaction.id) {
        // Update in database if logged in
        await updateTransaction(updatedTransaction.id, {
          amount: updatedTransaction.amount,
          type: updatedTransaction.type,
          category: updatedTransaction.category,
          description: updatedTransaction.description,
          date: new Date(updatedTransaction.date)
        });
        
        console.log("Transaction updated in database:", updatedTransaction);
      }
      
      // Update local state
      setTransactions(transactions.map(t => 
        t.id === updatedTransaction.id ? updatedTransaction : t
      ));
      
      toast({
        title: "Success",
        description: "Transaction updated successfully",
      });
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update transaction",
      });
    }
  };

  const handleDeleteTransaction = async (id: number) => {
    try {
      if (user?.id) {
        // Delete from database if logged in
        await deleteTransaction(id);
        console.log("Transaction deleted from database:", id);
      }
      
      // Update local state
      setTransactions(transactions.filter(t => t.id !== id));
      
      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete transaction",
      });
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || transaction.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Transactions</h1>
            <p className="text-muted-foreground">Manage and track your transactions</p>
          </div>
          <Dialog open={isAddingTransaction} onOpenChange={setIsAddingTransaction}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Transaction</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label>Description</label>
                  <Input
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({
                      ...newTransaction,
                      description: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <label>Amount (₹)</label>
                  <Input
                    type="number"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({
                      ...newTransaction,
                      amount: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <label>Category</label>
                  <Select
                    value={newTransaction.category}
                    onValueChange={(value) => setNewTransaction({
                      ...newTransaction,
                      category: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label>Type</label>
                  <Select
                    value={newTransaction.type}
                    onValueChange={(value: "income" | "expense") => setNewTransaction({
                      ...newTransaction,
                      type: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full" onClick={handleAddTransaction}>
                  Add Transaction
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Input
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="sm:max-w-[300px]"
            />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="sm:max-w-[200px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transactions</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expenses</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="text-center p-6">Loading transactions...</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>{transaction.category}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end">
                            <span
                              className={
                                transaction.type === "income"
                                  ? "text-green-500"
                                  : "text-red-500"
                              }
                            >
                              {transaction.type === "income" ? (
                                <ArrowUpRight className="inline w-4 h-4 mr-1" />
                              ) : (
                                <ArrowDownRight className="inline w-4 h-4 mr-1" />
                              )}
                              ₹{Math.abs(transaction.amount).toFixed(2)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingTransaction(transaction)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteTransaction(transaction.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </div>
      
      {editingTransaction && (
        <EditTransactionDialog
          isOpen={!!editingTransaction}
          onClose={() => setEditingTransaction(null)}
          transaction={editingTransaction}
          onSave={handleUpdateTransaction}
        />
      )}
    </AppLayout>
  );
};

export default Transactions;

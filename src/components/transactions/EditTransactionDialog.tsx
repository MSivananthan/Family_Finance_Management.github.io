
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

interface Transaction {
  id: number;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: "income" | "expense";
}

const categories = [
  "Food",
  "Transportation",
  "Utilities",
  "Entertainment",
  "Income",
  "Other"
];

interface EditTransactionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction;
  onSave: (updatedTransaction: Transaction) => void;
}

export const EditTransactionDialog = ({
  isOpen,
  onClose,
  transaction,
  onSave,
}: EditTransactionDialogProps) => {
  const [editedTransaction, setEditedTransaction] = useState(transaction);
  const { toast } = useToast();

  // Reset form when a new transaction is loaded
  useEffect(() => {
    setEditedTransaction(transaction);
  }, [transaction]);

  const validateTransaction = () => {
    if (!editedTransaction.description.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Description is required"
      });
      return false;
    }
    
    if (!editedTransaction.category) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Category is required"
      });
      return false;
    }
    
    if (isNaN(editedTransaction.amount) || editedTransaction.amount === 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please enter a valid amount"
      });
      return false;
    }
    
    return true;
  };

  const handleSave = () => {
    if (!validateTransaction()) {
      return;
    }
    
    // Ensure the amount has the correct sign based on type
    const updatedTransaction = {
      ...editedTransaction,
      amount: editedTransaction.type === "expense" 
        ? -Math.abs(editedTransaction.amount) 
        : Math.abs(editedTransaction.amount)
    };
    
    // Save the transaction to localStorage to ensure persistence
    try {
      const transactions = JSON.parse(localStorage.getItem('mock_db_transactions') || '[]');
      const existingIndex = transactions.findIndex((t: any) => t.id === updatedTransaction.id);
      
      if (existingIndex >= 0) {
        transactions[existingIndex] = {
          ...transactions[existingIndex],
          description: updatedTransaction.description,
          category: updatedTransaction.category,
          amount: updatedTransaction.amount,
          type: updatedTransaction.type,
          updated_at: new Date().toISOString()
        };
        
        localStorage.setItem('mock_db_transactions', JSON.stringify(transactions));
        console.log("Transaction updated in local storage:", updatedTransaction);
      }
    } catch (error) {
      console.error("Error updating transaction in localStorage:", error);
    }
    
    onSave(updatedTransaction);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label>Description</label>
            <Input
              value={editedTransaction.description}
              onChange={(e) =>
                setEditedTransaction({
                  ...editedTransaction,
                  description: e.target.value,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <label>Amount (₹)</label>
            <Input
              type="number"
              value={Math.abs(editedTransaction.amount)}
              onChange={(e) =>
                setEditedTransaction({
                  ...editedTransaction,
                  amount:
                    editedTransaction.type === "expense"
                      ? -Math.abs(Number(e.target.value))
                      : Math.abs(Number(e.target.value)),
                })
              }
            />
          </div>
          <div className="space-y-2">
            <label>Category</label>
            <Select
              value={editedTransaction.category}
              onValueChange={(value) =>
                setEditedTransaction({
                  ...editedTransaction,
                  category: value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
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
              value={editedTransaction.type}
              onValueChange={(value: "income" | "expense") =>
                setEditedTransaction({
                  ...editedTransaction,
                  type: value,
                  amount:
                    value === "expense"
                      ? -Math.abs(editedTransaction.amount)
                      : Math.abs(editedTransaction.amount),
                })
              }
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
          <Button className="w-full" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

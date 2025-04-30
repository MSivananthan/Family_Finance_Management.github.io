
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PiggyBank, Plus, Trash } from "lucide-react";
import { getCurrentUserId } from "@/hooks/useAuth";

interface Goal {
  id: number;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

export const FinancialGoals = () => {
  const [goals, setGoals] = useState<Goal[]>(() => {
    const savedGoals = localStorage.getItem('financial_goals');
    const userId = getCurrentUserId();
    if (savedGoals) {
      try {
        const parsedGoals = JSON.parse(savedGoals);
        // Filter goals for current user if logged in
        return userId ? parsedGoals.filter((goal: Goal & {user_id?: number}) => goal.user_id === userId) : parsedGoals;
      } catch (e) {
        console.error("Error parsing saved goals:", e);
        return [];
      }
    }
    return [];
  });
  
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    targetAmount: "",
    currentAmount: "",
    deadline: ""
  });

  const saveGoals = (updatedGoals: Goal[]) => {
    const userId = getCurrentUserId();
    // Get all existing goals including those for other users
    const allGoals = JSON.parse(localStorage.getItem('financial_goals') || '[]');
    // Filter out goals for the current user
    const otherUsersGoals = userId 
      ? allGoals.filter((goal: Goal & {user_id?: number}) => goal.user_id !== userId) 
      : [];
    
    // Add user_id to each goal if user is logged in
    const goalsToSave = userId 
      ? updatedGoals.map(goal => ({...goal, user_id: userId}))
      : updatedGoals;
    
    // Combine with other users' goals
    const combinedGoals = [...otherUsersGoals, ...goalsToSave];
    localStorage.setItem('financial_goals', JSON.stringify(combinedGoals));
  };

  const handleAddGoal = () => {
    if (!newGoal.title || !newGoal.targetAmount || !newGoal.deadline) {
      return;
    }
    
    const updatedGoals = [
      ...goals,
      {
        id: Date.now(),
        title: newGoal.title,
        targetAmount: parseFloat(newGoal.targetAmount),
        currentAmount: parseFloat(newGoal.currentAmount || "0"),
        deadline: newGoal.deadline
      }
    ];
    
    setGoals(updatedGoals);
    saveGoals(updatedGoals);
    
    setNewGoal({
      title: "",
      targetAmount: "",
      currentAmount: "",
      deadline: ""
    });
    setIsAddingGoal(false);
  };

  const handleDeleteGoal = (id: number) => {
    const updatedGoals = goals.filter(goal => goal.id !== id);
    setGoals(updatedGoals);
    saveGoals(updatedGoals);
  };

  const handleUpdateProgress = (id: number, amount: number) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === id) {
        return {
          ...goal,
          currentAmount: Math.min(goal.targetAmount, goal.currentAmount + amount)
        };
      }
      return goal;
    });
    
    setGoals(updatedGoals);
    saveGoals(updatedGoals);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <CardHeader className="p-0">
          <CardTitle className="text-xl">Financial Goals</CardTitle>
        </CardHeader>
        
        <Dialog open={isAddingGoal} onOpenChange={setIsAddingGoal}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Financial Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Goal Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Emergency Fund"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="target">Target Amount (₹)</Label>
                <Input
                  id="target"
                  type="number"
                  placeholder="50000"
                  value={newGoal.targetAmount}
                  onChange={(e) => setNewGoal({...newGoal, targetAmount: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="current">Current Amount (₹)</Label>
                <Input
                  id="current"
                  type="number"
                  placeholder="0"
                  value={newGoal.currentAmount}
                  onChange={(e) => setNewGoal({...newGoal, currentAmount: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="deadline">Target Date</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                />
              </div>
              <Button className="w-full" onClick={handleAddGoal}>
                Add Goal
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <CardContent className="p-0 space-y-4">
        {goals.length === 0 ? (
          <div className="text-center p-6 bg-secondary/20 rounded-md">
            <PiggyBank className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No financial goals yet. Add a goal to start tracking your progress!</p>
          </div>
        ) : (
          goals.map((goal) => {
            const progress = Math.floor((goal.currentAmount / goal.targetAmount) * 100);
            const remainingDays = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            const isOverdue = remainingDays < 0;
            
            return (
              <div key={goal.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{goal.title}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteGoal(goal.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-2 mb-3">
                  <Progress value={progress} />
                  <div className="flex justify-between text-sm">
                    <span>₹{goal.currentAmount.toLocaleString()}</span>
                    <span>₹{goal.targetAmount.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className={isOverdue ? "text-red-500" : "text-muted-foreground"}>
                    {isOverdue 
                      ? `Overdue by ${Math.abs(remainingDays)} days` 
                      : `${remainingDays} days left`
                    }
                  </span>
                  <span className="text-muted-foreground">{progress}% complete</span>
                </div>
                
                <div className="flex gap-2 mt-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleUpdateProgress(goal.id, 1000)}
                    className="text-xs"
                  >
                    + ₹1,000
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleUpdateProgress(goal.id, 5000)}
                    className="text-xs"
                  >
                    + ₹5,000
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleUpdateProgress(goal.id, 10000)}
                    className="text-xs"
                  >
                    + ₹10,000
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

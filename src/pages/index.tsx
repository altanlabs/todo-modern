import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle, Trash2, Binary, Cpu, LogOut } from "lucide-react";
import { fetchTodos, addTodo, updateTodo, deleteTodo } from '@/redux/slices/tables';
import { logout } from '@/redux/slices/auth';
import type { AppDispatch, RootState } from '@/redux/store';
import { useNavigate } from 'react-router-dom';

export default function TodoApp() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { items: todos = [], loading, error } = useSelector((state: RootState) => state.todos || { items: [] });
  const user = useSelector((state: RootState) => state.auth.user);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const handleAddTodo = async () => {
    if (newTodo.trim()) {
      await dispatch(addTodo({
        text: newTodo,
        completed: false,
        owner: user?.id || '',
        shared_with: [],
        list: '',
        labels: [],
        due_date: '',
        priority: 'Medium',
        time_spent: 0
      }));
      setNewTodo("");
    }
  };

  const handleToggleTodo = async (id: string, completed: boolean) => {
    await dispatch(updateTodo({ id, completed: !completed }));
  };

  const handleDeleteTodo = async (id: string) => {
    await dispatch(deleteTodo(id));
  };

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 p-8 flex items-center justify-center">
        <div className="text-cyan-400">Loading neural matrix...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 p-8 flex items-center justify-center">
        <div className="text-red-400">Neural interface error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Cpu className="w-8 h-8 text-cyan-400" />
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
                Neural Task Matrix
              </h1>
              <p className="text-gray-400 text-sm">Connected as: {user?.name}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-red-400"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Disconnect
          </Button>
        </div>

        <Card className="p-6 bg-black/40 border-gray-800 backdrop-blur-sm">
          <div className="flex gap-4 mb-6">
            <Input
              placeholder="Enter new task..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
              className="bg-gray-900/60 border-gray-700 text-gray-100 placeholder:text-gray-500"
            />
            <Button 
              onClick={handleAddTodo}
              className="bg-cyan-500 hover:bg-cyan-600 text-black"
            >
              <PlusCircle className="w-5 h-5 mr-1" />
              Add
            </Button>
          </div>

          <div className="space-y-3">
            {Array.isArray(todos) && todos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/40 border border-gray-700/50 hover:border-cyan-500/50 transition-colors"
              >
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => handleToggleTodo(todo.id, todo.completed)}
                  className="border-cyan-500 data-[state=checked]:bg-cyan-500"
                />
                <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : 'text-gray-100'}`}>
                  {todo.text}
                </span>
                <Badge variant="outline" className="bg-gray-900/60 text-cyan-400 border-cyan-500/30">
                  <Binary className="w-3 h-3 mr-1" />
                  {todo.completed ? 'Completed' : 'Pending'}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="text-gray-400 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, MoreVertical } from "lucide-react";
import { createTask } from '@/redux/slices/tasks';
import { TaskCard } from './TaskCard';
import type { AppDispatch } from '@/redux/store';
import type { List } from '@/types/lists';
import type { Task } from '@/types/tasks';

interface TaskListProps {
  list: List;
  tasks?: Task[];
}

export function TaskList({ list, tasks = [] }: TaskListProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [newTaskText, setNewTaskText] = useState('');
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  const handleCreateTask = async () => {
    if (newTaskText.trim()) {
      await dispatch(createTask({ 
        text: newTaskText,
        list: list.id
      }));
      setNewTaskText('');
      setIsCreatingTask(false);
    }
  };

  return (
    <Card className="bg-black/40 border-gray-800">
      <div className="p-3 border-b border-gray-800 flex items-center justify-between">
        <h3 className="font-medium text-gray-200">{list.name}</h3>
        <Button variant="ghost" size="icon">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-2 space-y-2">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}

        {isCreatingTask ? (
          <div className="space-y-2">
            <Input
              autoFocus
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              placeholder="Neural Task Description"
              className="bg-gray-900/60 border-gray-700 text-gray-100"
              onKeyPress={(e) => e.key === 'Enter' && handleCreateTask()}
            />
            <div className="flex gap-2">
              <Button
                onClick={handleCreateTask}
                className="bg-cyan-500 hover:bg-cyan-600 text-black"
              >
                Add
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsCreatingTask(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-400 hover:text-cyan-400"
            onClick={() => setIsCreatingTask(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Neural Task
          </Button>
        )}
      </div>
    </Card>
  );
}
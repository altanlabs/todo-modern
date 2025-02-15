import { useDispatch } from 'react-redux';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Clock, Tag } from "lucide-react";
import { updateTask } from '@/redux/slices/tasks';
import type { AppDispatch } from '@/redux/store';
import type { Task } from '@/types/tasks';

interface TaskCardProps {
  task: Task;
}

const priorityColors = {
  High: 'bg-red-500/20 text-red-400 border-red-500/30',
  Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Low: 'bg-green-500/20 text-green-400 border-green-500/30'
};

export function TaskCard({ task }: TaskCardProps) {
  const dispatch = useDispatch<AppDispatch>();

  const handleToggleComplete = () => {
    dispatch(updateTask({
      id: task.id,
      updates: { completed: !task.completed }
    }));
  };

  return (
    <Card className="bg-gray-800/40 border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300">
      <div className="p-3 space-y-2">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={task.completed}
            onCheckedChange={handleToggleComplete}
            className="mt-1 border-cyan-500 data-[state=checked]:bg-cyan-500"
          />
          <div className="flex-1">
            <p className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-200'}`}>
              {task.text}
            </p>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {task.priority && (
                <Badge variant="outline" className={priorityColors[task.priority]}>
                  {task.priority} Priority
                </Badge>
              )}
              
              {task.due_date && (
                <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(task.due_date).toLocaleDateString()}
                </Badge>
              )}

              {task.time_spent > 0 && (
                <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  <Clock className="w-3 h-3 mr-1" />
                  {task.time_spent}h
                </Badge>
              )}

              {task.labels && task.labels.map((label, index) => (
                <Badge key={index} variant="outline" className="bg-gray-700/50">
                  <Tag className="w-3 h-3 mr-1" />
                  {label}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
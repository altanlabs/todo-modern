import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, MoreVertical } from "lucide-react";
import { createList } from '@/redux/slices/lists';
import { TaskList } from '../task/TaskList';
import type { AppDispatch } from '@/redux/store';
import type { Board } from '@/types/boards';
import type { List } from '@/types/lists';

interface BoardViewProps {
  board: Board;
  lists: List[];
}

export function BoardView({ board, lists }: BoardViewProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [newListName, setNewListName] = useState('');
  const [isCreatingList, setIsCreatingList] = useState(false);

  const handleCreateList = async () => {
    if (newListName.trim()) {
      await dispatch(createList({ 
        name: newListName,
        boardId: board.id
      }));
      setNewListName('');
      setIsCreatingList(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-100">{board.name}</h2>
          <p className="text-gray-400">{board.description}</p>
        </div>
        <Button variant="ghost" size="icon">
          <MoreVertical className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {lists.map((list) => (
          <div key={list.id} className="min-w-[300px]">
            <TaskList list={list} />
          </div>
        ))}

        {isCreatingList ? (
          <Card className="min-w-[300px] p-3 bg-black/40 border-gray-800">
            <div className="space-y-3">
              <Input
                autoFocus
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="Neural Sequence Name"
                className="bg-gray-900/60 border-gray-700 text-gray-100"
                onKeyPress={(e) => e.key === 'Enter' && handleCreateList()}
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleCreateList}
                  className="bg-cyan-500 hover:bg-cyan-600 text-black"
                >
                  Create
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setIsCreatingList(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <Card
            className="min-w-[300px] p-3 bg-black/40 border-gray-800 border-dashed hover:border-cyan-500/50 cursor-pointer transition-all duration-300 flex items-center justify-center"
            onClick={() => setIsCreatingList(true)}
          >
            <div className="flex items-center gap-2 text-gray-400 hover:text-cyan-400">
              <Plus className="w-5 h-5" />
              <span>Add Neural Sequence</span>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
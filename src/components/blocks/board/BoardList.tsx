import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, LayoutGrid } from "lucide-react";
import { createBoard } from '@/redux/slices/boards';
import type { AppDispatch } from '@/redux/store';
import type { Board } from '@/types/boards';

interface BoardListProps {
  boards: Board[];
  onSelectBoard: (board: Board) => void;
}

export function BoardList({ boards, onSelectBoard }: BoardListProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [newBoardName, setNewBoardName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateBoard = async () => {
    if (newBoardName.trim()) {
      await dispatch(createBoard({ 
        name: newBoardName,
        description: 'Neural interface workspace'
      }));
      setNewBoardName('');
      setIsCreating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {boards.map((board) => (
        <Card
          key={board.id}
          className="p-4 bg-black/40 border-gray-800 hover:border-cyan-500/50 cursor-pointer transition-all duration-300 group"
          onClick={() => onSelectBoard(board)}
        >
          <div className="flex items-center gap-3">
            <LayoutGrid className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300" />
            <div>
              <h3 className="font-medium text-gray-200 group-hover:text-cyan-300">
                {board.name}
              </h3>
              <p className="text-sm text-gray-400">
                {board.description}
              </p>
            </div>
          </div>
        </Card>
      ))}

      {isCreating ? (
        <Card className="p-4 bg-black/40 border-gray-800">
          <div className="space-y-3">
            <Input
              autoFocus
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              placeholder="Neural Matrix Name"
              className="bg-gray-900/60 border-gray-700 text-gray-100"
              onKeyPress={(e) => e.key === 'Enter' && handleCreateBoard()}
            />
            <div className="flex gap-2">
              <Button
                onClick={handleCreateBoard}
                className="bg-cyan-500 hover:bg-cyan-600 text-black"
              >
                Create
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsCreating(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <Card
          className="p-4 bg-black/40 border-gray-800 border-dashed hover:border-cyan-500/50 cursor-pointer transition-all duration-300 flex items-center justify-center"
          onClick={() => setIsCreating(true)}
        >
          <div className="flex items-center gap-2 text-gray-400 hover:text-cyan-400">
            <Plus className="w-5 h-5" />
            <span>Create Neural Matrix</span>
          </div>
        </Card>
      )}
    </div>
  );
}
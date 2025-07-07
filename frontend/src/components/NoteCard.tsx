import { Trash2 } from 'lucide-react';

interface NoteCardProps {
  title: string;
  content: string;
  onDelete: () => void;
}

export default function NoteCard({ title, content, onDelete }: NoteCardProps) {
  return (
    <div className="bg-white rounded-lg shadow px-4 py-3 flex justify-between items-start border">
        {/* Display Title */}
      <div>
        <h2 className="text-base font-medium text-black">{title}</h2>
        <p className="text-gray-600 mt-1 text-sm">{content}</p>
      </div>
      <Trash2
        size={18}
        className="text-gray-400 hover:text-red-500 cursor-pointer mt-1"
        onClick={onDelete}
      />
    </div>
  );
}

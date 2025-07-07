import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { noteService } from '../services/noteService';
import { toast } from 'react-toastify';
import NoteCard from '../components/NoteCard';
// import CreateNoteButton from '../components/CreateNoteButton';

interface Note {
    _id: string;
    title: string;
    content: string;
}

export default function Dashboard() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [userEmail, setUserEmail] = useState('');
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();

    const fetchNotes = async () => {
        const token = localStorage.getItem('jwt_token');
        if (!token) return navigate('/signin');

        try {
            const res = await noteService.getNotes(token);
            setNotes(res.data);
        } catch {
            toast.error('Failed to fetch notes');
        }
    };

    const handleDelete = async (noteId: string) => {
        const token = localStorage.getItem('jwt_token');
        try {
            await noteService.deleteNote(noteId, token!);
            toast.success('Note deleted');
            fetchNotes();
        } catch {
            toast.error('Delete failed');
        }
    };

    const logout = () => {
        localStorage.clear();
        navigate('/signin');
    };

    useEffect(() => {
        const token = localStorage.getItem('jwt_token');
        const email = localStorage.getItem('user_email');
        const name = localStorage.getItem('user_name');


        if (!token || !email) {
            navigate('/signin');
        } else {
            setUserEmail(email);
            setUserName(name || 'User');
            fetchNotes();
        }
    }, []);

    return (
        <div className="min-h-screen bg-white px-4 py-4">
            {/* Header */}
            <div className="flex justify-between items-center px-2 md:px-6 mb-6">
                <div className="flex items-center">
                    <img src="/icon.png" alt="HD Logo" className="w-6 h-6 mr-2" />
                    <span className="text-lg font-semibold tracking-wide">Dashboard</span>
                </div>
                <button
                    onClick={logout}
                    className="text-blue-600 font-medium text-sm hover:underline"
                >
                    Sign Out
                </button>
            </div>

            {/* Welcome Info */}
            <div className="border border-gray-300 text-center p-4 rounded-lg mb-6 max-w-xl mx-auto shadow-md">
                <h3 className="text-lg font-bold">Welcome, {userName}!</h3>
                <p className="text-sm text-gray-600">Email: {userEmail}</p>
            </div>

            {/* Create Note Button */}
            <div className="mb-6 max-w-xl mx-auto">
                <button
                    onClick={() => navigate('/create-note')}
                    className="w-full bg-[#367AFF] hover:bg-blue-600 text-white py-3 rounded-lg text-sm font-semibold"
                >
                    Create Note
                </button>
            </div>

            {/* Notes Heading */}
            <div className="max-w-xl mx-auto mb-3 px-1">
                <h3 className="text-md font-medium text-gray-800">Notes</h3>
            </div>

            {/* Notes List */}
            <div className="space-y-4 max-w-xl mx-auto">
                {notes.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center">No notes available</p>
                ) : (
                    notes.map((note) => (
                        <NoteCard
                            key={note._id}
                            title={note.title}
                            content={note.content}
                            onDelete={() => handleDelete(note._id)}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

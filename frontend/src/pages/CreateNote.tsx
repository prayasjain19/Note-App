import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { noteService } from '../services/noteService';
import { toast } from 'react-toastify';

interface NoteForm {
    title: string;
    content: string;
}

export default function CreateNote() {
    const { register, handleSubmit, formState: { errors } } = useForm<NoteForm>();
    const navigate = useNavigate();

    const onSubmit = async (data: NoteForm) => {
        const token = localStorage.getItem('jwt_token');
        if (!token) return navigate('/signin');

        try {
            await noteService.createNote(data, token);
            toast.success('Note created!');
            navigate('/dashboard');
        } catch (err) {
            toast.error('Failed to create note');
        }
    };

    return (
        <div className="min-h-screen bg-white flex justify-center items-center px-4">
            <div className="w-full max-w-xl p-6 bg-gray-50 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-4 text-center">Create a New Note</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        {/* Input Field */}
                        <input
                            {...register('title', { required: true })}
                            placeholder="Title"
                            className="w-full border px-4 py-2 rounded"
                        />
                        {errors.title && <p className="text-sm text-red-500">Title is required</p>}
                    </div>
                    <div>
                        {/* Text Area */}
                        <textarea
                            {...register('content', { required: true })}
                            placeholder="Content"
                            className="w-full border px-4 py-2 rounded h-40 resize-none"
                        />
                        {errors.content && <p className="text-sm text-red-500">Content is required</p>}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold"
                    >
                        Save Note
                    </button>
                </form>
            </div>
        </div>
    );
}

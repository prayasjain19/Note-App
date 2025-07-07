import { Note } from "../../../domain/entities/Note.entity";
import { NoteRepository } from "../../../domain/repositories/NoteRepository";
import { NoteModel } from "../models/NoteModel";
function sanitizeNote(data: any): Note {
    return {
        ...data,
        _id: data._id.toString(), // convert to string for frontend, optional
    };
}

export class MongoNoteRepository implements NoteRepository {
    async create(note: Note): Promise<Note> {
        const created = await NoteModel.create(note);
        return sanitizeNote(created.toObject());
    }

    async delete(noteId: string, userId: string): Promise<void> {
        await NoteModel.deleteOne({_id: noteId, userId});
    }
    async findByUserId(userId: string): Promise<Note[]> {
        const notes =  await NoteModel.find({userId}).sort({createdAt: -1}).lean();
        return notes.map(sanitizeNote);
    }
    async update(noteId: string, userId: string, updates: Partial<Note>): Promise<Note | null> {
        const updated = await NoteModel.findOneAndUpdate({_id: noteId, userId}, updates, {new : true}).lean();
        return updated as Note | null;
    }
}
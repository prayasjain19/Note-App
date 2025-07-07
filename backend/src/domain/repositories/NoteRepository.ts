import { Note } from "../entities/Note.entity";

export interface NoteRepository {
    create(note: Note): Promise<Note>
    delete(noteId: string, userId: string): Promise<void>;
    findByUserId(userId: string): Promise<Note[]>;
    update(noteId: string, userId: string, updates: Partial<Note>): Promise<Note | null>
}
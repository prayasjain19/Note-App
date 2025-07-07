import { Note } from "../../domain/entities/Note.entity";
import { NoteRepository } from "../../domain/repositories/NoteRepository";

export class UpdateNoteUseCase {
    constructor(
        private noteRepo: NoteRepository
    ) { }

    async execute(noteId: string, userId: string, updates: Partial<Note>): Promise<Note | null> {
        const updated = await this.noteRepo.update(noteId, userId, updates);
        if (!updated) {
            throw new Error("Note not found or unauthorized");
        }
        return updated;
    }

}

import { Note } from "../../domain/entities/Note.entity";
import { NoteRepository } from "../../domain/repositories/NoteRepository";
import { CreateNoteRequestDTO } from "../dtos/note/CreateNoteRequest.dto";

export class CreateNoteUseCase {
    constructor(
        private noteRepo: NoteRepository
    ) { }

    async execute(userId: string, data: { title: string; content: string; }): Promise<Note> {
        const note: Note = {
            title: data.title,
            content: data.content,
            userId
        };

        return await this.noteRepo.create(note);
    }
}
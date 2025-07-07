import { NoteRepository } from "../../domain/repositories/NoteRepository";


export class DeleteNoteUseCase{
    constructor(
        private noteRepo: NoteRepository
    ){}

    async execute(noteId: string, userId: string){
        await this.noteRepo.delete(noteId, userId)
    }
}
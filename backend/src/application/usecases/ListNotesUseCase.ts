import { NoteRepository } from '../../domain/repositories/NoteRepository';

export class ListNotesUseCase {
  constructor(private noteRepo: NoteRepository) {}

  async execute(userId: string) {
    return await this.noteRepo.findByUserId(userId);
  }
}

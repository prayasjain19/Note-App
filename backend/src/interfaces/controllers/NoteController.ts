import { Request, Response } from 'express';
import { MongoNoteRepository } from '../../infrastructure/db/repositories/MongoNoteRepository';
import { CreateNoteUseCase } from '../../application/usecases/CreateNoteUseCase';
import { DeleteNoteUseCase } from '../../application/usecases/DeleteNoteUseCase';
import { ListNotesUseCase } from '../../application/usecases/ListNotesUseCase';
import { UpdateNoteUseCase } from '../../application/usecases/UpdateNoteUseCase';
// import './types/express'; //

const noteRepo = new MongoNoteRepository();

const createNoteUC = new CreateNoteUseCase(noteRepo);
const deleteNoteUC = new DeleteNoteUseCase(noteRepo);
const listNotesUC = new ListNotesUseCase(noteRepo);
const updateNotesUC = new UpdateNoteUseCase(noteRepo);

export const NoteController = {
    create: async (req: Request, res: Response) => {
        try {
            const note = await createNoteUC.execute(req.user!.userId, req.body);
            res.json(note);
        } catch (err) {
            res.status(400).json({ error: (err as Error).message });
        }
    },

    remove: async (req: Request, res: Response) => {
        try {
            await deleteNoteUC.execute(req.params.id, req.user!.userId);
            res.json({ message: 'Note deleted' });
        } catch (err) {
            res.status(400).json({ error: (err as Error).message });
        }
    },

    list: async (req: Request, res: Response) => {
        try {
            const notes = await listNotesUC.execute(req.user!.userId);
            res.json(notes);
        } catch (err) {
            res.status(400).json({ error: (err as Error).message });
        }
    },
    update: async(req:Request, res: Response)=>{
        try {
            const updated = await updateNotesUC.execute(req.params.id, req.user!.userId, req.body);
            res.json(updated);
        } catch (err: unknown) {
            res.status(400).json({ error: (err as Error).message });
        }
    }
};

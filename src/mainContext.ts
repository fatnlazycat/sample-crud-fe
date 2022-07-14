import React from 'react';
import { Note } from './entity/note';

export type MainCtx = {
  isLoading: boolean;
  notes?: Note[];
};

export const MainContext = React.createContext({} as MainCtxConfiguration);
export type MainCtxConfiguration = {
  mainCtxState: MainCtx;
  dispatch: React.Dispatch<DispatchArg>;
};

export enum Actions {
  SetLoading,
  SetNotes,
  UpdateNote,
  DeleteNote,
}

export type DispatchArg = {
  action: Actions;
  payload: any;
};

export const reducer = (state: MainCtx, arg: DispatchArg): MainCtx => {
  switch (arg.action) {
    case Actions.SetLoading:
      return { ...state, isLoading: arg.payload };
      
    case Actions.SetNotes:
      const newNotes = (arg.payload as Note[]).sort((first, second) => (first.id || 0) - (second.id || 0));
      return { ...state, notes: newNotes };

    case Actions.UpdateNote:
      const updatedNote = arg.payload as Note;
      const { id } = updatedNote;
      const updatedNotes = (() => {
        let updated = false;
        const result = state.notes?.map((n) => {
          if (n.id === id) {
            updated = true;
            return updatedNote;
           } else {
             return n;
          };
        });
        return updated ? result : state.notes?.concat(updatedNote);  
      })();
      return { ...state, notes: updatedNotes };

    case Actions.DeleteNote:
      const deletedId = (arg.payload as Note).id
      return { ...state, notes: state.notes?.filter((n) => deletedId !== n.id)}

    default:
      return state;
  }
};
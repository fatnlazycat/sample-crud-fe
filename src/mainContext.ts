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
      return { ...state, notes: arg.payload as Note[] };
    case Actions.UpdateNote:
      const updatedNote = arg.payload as Note;
      const { id } = updatedNote;
      return { ...state, notes: state.notes?.map((n) => n.id === id ? updatedNote : n) };
    default:
      return state;
  }
};
import React from 'react';
import { Note } from '../entity/note';
import { NoteTitle, StyledCard } from './cardStyles';

type Props = {
  note: Note;
  key: any;
}

export const NoteCard = ({ note, key }: Props): JSX.Element => {
  return (<div key={key}>
    <StyledCard>
      <NoteTitle>{note.text}</NoteTitle>
    </StyledCard>
  </div>)
}

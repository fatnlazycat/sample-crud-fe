import Card from 'antd/lib/card/Card';
import React from 'react';
import { Note } from '~/entity/note';
import { NoteTitle } from './cardStyles';

type Props = {
  note: Note
}

export const NoteCard = ({ note }: Props): JSX.Element => {
  return (<Card>
    <NoteTitle>{note.text}</NoteTitle>
  </Card>)
}

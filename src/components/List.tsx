import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Carousel, Switch } from 'antd';

import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Note } from '~/entity/note';
import { Actions, MainContext } from '~/mainContext';
import { useApiCall } from '~/network/useApiCall';
import { useSaveNote } from '~/network/useSaveNote';
import { NoteCard } from './Card';
import { EditNoteModal } from './EditNoteModal';
import { ButtonsContainer, Container, SwitchContainer } from './listStyles';

// type Props = {
//   data: Note[]
// }

enum MODAL_STATE {
  Hidden = 0,
  Create = 1,
  Edit = 2,
};

export const List = (): JSX.Element => {
  const [{
    response: allNotesResponse, error: allNotesError, isLoading: gettingAllNotes,
  }, getNotes] = useApiCall(`${process.env.BASE_URL}/notes`);

  const [{
    response: saveNoteResponse, error: saveNoteError, isLoading: savingNote,
  }, saveNote] = useSaveNote();
  
  const [{
    response: deleteResponse, error: deleteError, isLoading: isDeleting,
  }, deleteNote] = useApiCall('');

  const { mainCtxState, dispatch } = useContext(MainContext);
  const [currentNote, setCurrentNote] = useState(new Note());
  const [modalState, setModalState] = useState(MODAL_STATE.Hidden);

  const notes = useMemo(() => mainCtxState.notes || [], [mainCtxState]);

  useEffect(() => {
    getNotes();
  }, [getNotes]);

  useEffect(() => {
    const reducedLoading = gettingAllNotes || savingNote;
    dispatch({ action: Actions.SetLoading, payload: reducedLoading })
  }, [dispatch, gettingAllNotes, savingNote])

  useEffect(() => {
    const { data } = allNotesResponse || {};
    data && dispatch({ action: Actions.SetNotes, payload: data });
  }, [allNotesResponse, dispatch]);

  useEffect(() => {
    saveNoteResponse && dispatch({ action: Actions.UpdateNote, payload: saveNoteResponse });
  }, [saveNoteResponse, dispatch]);

  const noteForModal = useMemo(() => 
    modalState === MODAL_STATE.Edit ? currentNote : new Note(),
    [modalState, currentNote]
  );

  const onModalSubmit = useCallback((note: Note) => {
    saveNote(note);
    setModalState(0);
  }, [saveNote]);

  const onScroll = useCallback((index: number) => {
    setCurrentNote(notes[index]);
  }, [notes]);

  const onCompletedPress = useCallback((checked: boolean) => {
    saveNote({ ...currentNote, completed: checked });
  }, [saveNote, currentNote]);

  const onDelete = useCallback(() => {
    deleteNote({
      url: `${process.env.BASE_URL}/notes/${currentNote.id}`,
      method: 'delete',
    });
  }, [deleteNote, currentNote]);

  const showModalForCreate = useCallback(() => setModalState(MODAL_STATE.Create), []);
  const showModalForEdit = useCallback(() => setModalState(MODAL_STATE.Edit), []);

  return (<Container>
    {currentNote && <EditNoteModal
      visible={Boolean(modalState)}
      note={noteForModal}
      onSubmit={onModalSubmit}
    />}
    <Carousel
      afterChange={onScroll}
    >
      {notes.map((note) => <NoteCard note={note}/>)}
    </Carousel>

    <SwitchContainer>
      <Switch
        checked={currentNote?.completed}
        onChange={onCompletedPress}
      />
    </SwitchContainer>
    <ButtonsContainer>
      <Button
        onClick={showModalForCreate}
      >
        <PlusCircleOutlined />
      </Button>
      <Button
        onClick={showModalForEdit}
      >
        <EditOutlined />
      </Button>
      <Button
        onClick={onDelete}
      >
        <DeleteOutlined />
      </Button>
    </ButtonsContainer>
  </Container>)
}
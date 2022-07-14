import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Switch } from 'antd';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { find } from 'lodash';
import { Note } from '../entity/note';
import { Actions, MainContext } from '../mainContext';
import { useApiCall } from '../network/useApiCall';
import { useSaveNote } from '../network/useSaveNote';
import { NoteCard } from './Card';
import { EditNoteModal } from './EditNoteModal';
import { ButtonsContainer, StyledCarousel, Container, SwitchContainer, CarouselContainer, CompletedLabel, Title } from './listStyles';

enum MODAL_STATE {
  Hidden = 0,
  Create = 1,
  Edit = 2,
};

export const List = (): JSX.Element => {
  const [{
    response: allNotesResponse, error: allNotesError, isLoading: gettingAllNotes,
  }, getNotes] = useApiCall(`${process.env.REACT_APP_BASE_URL}/notes`);

  const [{
    response: saveNoteResponse, error: saveNoteError, isLoading: savingNote,
  }, saveNote] = useSaveNote();
  
  const [{
    response: deleteResponse, error: deleteError, isLoading: isDeleting,
  }, deleteNote] = useApiCall('');

  const { mainCtxState, dispatch } = useContext(MainContext);
  
  const [modalState, setModalState] = useState(MODAL_STATE.Hidden);
  const [currentNoteId, setCurrentNoteId] = useState<number>(0);

  const notes = useMemo(() => mainCtxState.notes || [], [mainCtxState]);
  const currentNote = useMemo(() => find(notes, ['id', currentNoteId]) || new Note(), [notes, currentNoteId]);

  // effects
  useEffect(() => {
    getNotes();
  }, [getNotes]);

  useEffect(() => {
    (!currentNoteId && notes[0]?.id) && setCurrentNoteId(notes[0].id);
  }, [notes, currentNoteId]);

  useEffect(() => {
    const reducedLoading = gettingAllNotes || savingNote || isDeleting;
    dispatch({ action: Actions.SetLoading, payload: reducedLoading })
  }, [dispatch, gettingAllNotes, savingNote, isDeleting]);

  useEffect(() => {
    const { data } = allNotesResponse || {};
    data && dispatch({ action: Actions.SetNotes, payload: data });
  }, [allNotesResponse, dispatch]);

  useEffect(() => {
    const { data } = deleteResponse || {};
    data && dispatch({ action: Actions.DeleteNote, payload: data });
  }, [deleteResponse, dispatch]);

  useEffect(() => {
    if (saveNoteResponse) {
      const savedId = saveNoteResponse.id;
      console.log('saveNoteResponse effect, savedId=', savedId);
      savedId && setCurrentNoteId(savedId)
      dispatch({ action: Actions.UpdateNote, payload: saveNoteResponse });
    }
  }, [saveNoteResponse, dispatch]);

  const noteForModal = useMemo(() => 
    modalState === MODAL_STATE.Edit ? currentNote : new Note(),
    [modalState, currentNote]
  );


  // callbacks
  const onModalSubmit = useCallback((note: Note) => {
    saveNote(note);
    setModalState(0);
  }, [saveNote]);

  const onScroll = useCallback((from: number, to: number) => {
    if (from !== to) setCurrentNoteId(notes[to].id || 0);
  }, [notes]);

  const onCompletedPress = useCallback((checked: boolean) => {
    currentNote && saveNote({ ...currentNote, completed: checked });
  }, [saveNote, currentNote]);

  const onDelete = useCallback(() => {
    currentNoteId && deleteNote({
      url: `${process.env.REACT_APP_BASE_URL}/notes/${currentNoteId}`,
      method: 'delete',
    });
  }, [deleteNote, currentNoteId]);

  const showModalForCreate = useCallback(() => setModalState(MODAL_STATE.Create), []);
  const showModalForEdit = useCallback(() => setModalState(MODAL_STATE.Edit), []);

  return (<Container>
    <EditNoteModal
      visible={Boolean(modalState)}
      note={noteForModal}
      onSubmit={onModalSubmit}
      onCancel={() => setModalState(MODAL_STATE.Hidden)}
    />
    <Title>Sample CRUD test-task for Connected Insurance</Title>
    <CarouselContainer>
      <StyledCarousel
        initialSlide={Math.max(notes.findIndex((n) => n.id === currentNoteId), 0)}
        beforeChange={onScroll}
      >
        {notes.map((note, index) => <NoteCard key={index} note={note}/>)}
    </StyledCarousel>
    </CarouselContainer>

    <SwitchContainer>
      <CompletedLabel>
        Completed ?
      </CompletedLabel>
      <Switch
        checked={currentNote.completed}
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
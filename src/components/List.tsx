import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Switch } from 'antd';
import { CarouselRef } from 'antd/lib/carousel';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
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
  const [currentNote, setCurrentNote] = useState<Note>();
  const [modalState, setModalState] = useState(MODAL_STATE.Hidden);
  const [newNoteId, setNewNoteId] = useState(0);

  const notes = useMemo(() => mainCtxState.notes || [], [mainCtxState]);

  const carouselRef = useRef<CarouselRef>(null);

  useEffect(() => {
    setCurrentNote((prev) => {
      let idToSet: number | undefined;
      if (newNoteId) {
        idToSet = newNoteId;
        setNewNoteId(0);
      } else {
        idToSet = prev?.id;
      }
      return notes.find((n) => n.id === idToSet) || notes[0]}
    );
  }, [notes, newNoteId]);

  useEffect(() => {
    getNotes();
  }, [getNotes]);

  useEffect(() => {
    const reducedLoading = gettingAllNotes || savingNote || isDeleting;
    dispatch({ action: Actions.SetLoading, payload: reducedLoading })
  }, [dispatch, gettingAllNotes, savingNote, isDeleting])

  useEffect(() => {
    const { data } = allNotesResponse || {};
    data && dispatch({ action: Actions.SetNotes, payload: data });
  }, [allNotesResponse, dispatch]);

  useEffect(() => {
    if (saveNoteResponse) {
      const savedId = saveNoteResponse.id;
      savedId && setNewNoteId(savedId)
      dispatch({ action: Actions.UpdateNote, payload: saveNoteResponse });
    }
  }, [saveNoteResponse, dispatch]);

  useEffect(() => {
    const { data } = deleteResponse || {};
    data && dispatch({ action: Actions.DeleteNote, payload: data });
  }, [deleteResponse, dispatch]);

  const noteForModal = useMemo(() => 
    (modalState === MODAL_STATE.Edit && currentNote) ? currentNote : new Note(),
    [modalState, currentNote]
  );

  useEffect(() => {
    const currentId = currentNote?.id;
    const index = Math.max(notes.findIndex((n) => n.id === currentId), 0);
    carouselRef.current?.goTo(index, false);
  }, [currentNote, notes, carouselRef]);

  
  // callbacks
  const onModalSubmit = useCallback((note: Note) => {
    saveNote(note);
    setModalState(0);
  }, [saveNote]);

  const onScroll = useCallback((from: number, to: number) => {
    if (from !== to) setCurrentNote(notes[to]);
  }, [notes]);

  const onCompletedPress = useCallback((checked: boolean) => {
    currentNote && saveNote({ ...currentNote, completed: checked });
  }, [saveNote, currentNote]);

  const onDelete = useCallback(() => {
    currentNote && deleteNote({
      url: `${process.env.REACT_APP_BASE_URL}/notes/${currentNote.id}`,
      method: 'delete',
    });
  }, [deleteNote, currentNote]);

  const showModalForCreate = useCallback(() => setModalState(MODAL_STATE.Create), []);
  const showModalForEdit = useCallback(() => setModalState(MODAL_STATE.Edit), []);

  
  return (<Container>
    <EditNoteModal
      visible={Boolean(modalState)}
      note={noteForModal}
      onSubmit={onModalSubmit}
      onCancel={() => setModalState(MODAL_STATE.Hidden)}
    />
    <Title>Sample CRUD test-task for Creative Insurance</Title>
    <CarouselContainer>
      <StyledCarousel
        ref={carouselRef}
        beforeChange={onScroll}
      >
        {notes.map((note, index) => <NoteCard key={index} note={note}/>)}
    </StyledCarousel>
    </CarouselContainer>

    {currentNote && <SwitchContainer>
      <CompletedLabel>
        Completed ?
      </CompletedLabel>
      <Switch
        checked={currentNote.completed}
        onChange={onCompletedPress}
      />
    </SwitchContainer>}
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
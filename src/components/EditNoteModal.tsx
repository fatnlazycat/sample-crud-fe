import { Button, Input } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { Note } from "../entity/note";
import { EditNoteModalContent, StyledModal } from "./editNoteModalStyles";

type Props = {
  visible: boolean;
  note: Note;
  onSubmit: (note: Note) => void;
  onCancel: () => void;
}

export const EditNoteModal = ({ visible, note, onSubmit, onCancel }: Props): JSX.Element => {
  const [text, setText] = useState('');
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    const newText = note.text;
    setText(newText);
  }, [note]);
  
  const onTextChanged = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    !changed && setChanged(true);
    setText(event.target.value)
  }, [changed]);

  const submit = useCallback(() => {
    if (changed && text) {
      const updatedNote = { ...note, text };
      onSubmit(updatedNote);
    }
  }, [changed, note, onSubmit, text])

  return (<StyledModal
    visible={visible}
    title='Enter the note message'
    destroyOnClose={true}
    footer={null}
    onCancel={onCancel}
  >
    <EditNoteModalContent>
      <Input
        value={text}
        onChange={onTextChanged}
      />
    </EditNoteModalContent>
    <Button onClick={submit}>Submit</Button>
  </StyledModal>);
};
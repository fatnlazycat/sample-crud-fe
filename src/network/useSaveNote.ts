import { useCallback, useEffect, useState } from "react";
import { Note } from "~/entity/note";
import { useApiCall } from "./useApiCall";

export const useSaveNote = (): [
  { response: Note | undefined, error: unknown, isLoading: boolean }, (note: Note) => void,
] => {
  
  const [{ response, error, isLoading }, callSave] = useApiCall(`${process.env.BASE_URL}/notes`);
  const [responseNote, setResponseNote] = useState<Note>();

  const saveNote = useCallback((note: Note) => {
    callSave({
      data: note,
      method: note.id ? 'patch' : 'post',
    });
  }, [callSave]);

  useEffect(() => {
    response && setResponseNote(response.data);
  }, [response]);

  return [{ response: responseNote, error, isLoading }, saveNote];
};
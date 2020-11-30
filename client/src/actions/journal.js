import axios from 'axios';
import { setAlert } from './alert';
import {
  GET_PUBLIC_JOURNALS,
  DELETE_JOURNAL,
  ADD_JOURNAL,
  GET_JOURNAL,
  GET_JOURNALS,
  JOURNAL_ERROR,
  UPDATE_JOURNAL,
  UPDATE_LIKES,
} from './types';

//Get all users' public journals
export const getPublicJournals = () => async (dispatch) => {
  try {
    const res = await axios.get('journals');
    dispatch({
      type: GET_PUBLIC_JOURNALS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: JOURNAL_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Get current user's all journals
export const getJournals = () => async (dispatch) => {
  try {
    const res = await axios.get('/journals/mine');
    dispatch({
      type: GET_JOURNALS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: JOURNAL_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
//Get one specific user's all public journals
export const getUserPublicJournals = (userId) => async (dispatch) => {
  try {
    const res = await axios.get(`/journals/${userId}/public_journals`);
    dispatch({
      type: GET_JOURNALS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: JOURNAL_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Get specific journal by id
export const getJournal = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/journals/${id}`);
    dispatch({
      type: GET_JOURNAL,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: JOURNAL_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Create a journal
export const addJournal = (formData, history) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    const res = await axios.post('/journals', formData, config);
    dispatch({
      type: ADD_JOURNAL,
      payload: res.data,
    });
    dispatch(setAlert('Journal added', 'success'));
    history.push('/journals/mine');
  } catch (err) {
    dispatch({
      type: JOURNAL_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Delete a specific journal 
export const deleteJournal = (id, history) => async (dispatch) => {
  try {
    await axios.delete(`/journals/${id}`);
    dispatch({
      type: DELETE_JOURNAL,
      payload: id,
    });
    dispatch(setAlert('Journal removed', 'success'));
    history.push('/journals/mine');
  } catch (err) {
    dispatch({
      type: JOURNAL_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Update a journal
export const updateJournal = (id, formData, history) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    const res = await axios.put(`/journals/${id}`, formData, config);
    dispatch({
      type: UPDATE_JOURNAL,
      payload: res.data,
    });
    dispatch(setAlert('Journal updated', 'success'));
    history.push(`/journals/journal/${id}`);
  } catch (err) {
    dispatch({
      type: JOURNAL_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    });
  }
};

//Like a specific journal
export const addLike = (journalId, history) => async (dispatch) => {
  try {
    const res = await axios.put(`/journals/like/${journalId}`);
    dispatch({
      type: UPDATE_LIKES,
      payload: { journalId, likes: res.data },
    });

    history.goBack();
  } catch (err) {
    dispatch({
      type: JOURNAL_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
    dispatch(setAlert('You already liked this journal', 'danger'));
  }
};

//Unlike a specific journal
export const removeLike = (journalId, history) => async (dispatch) => {
  try {
    const res = await axios.put(`/journals/unlike/${journalId}`);
    dispatch({
      type: UPDATE_LIKES,
      payload: { journalId, likes: res.data },
    });
    history.goBack();
  } catch (err) {
    dispatch({
      type: JOURNAL_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
    dispatch(setAlert('You already unliked this journal', 'danger'));
  }
};

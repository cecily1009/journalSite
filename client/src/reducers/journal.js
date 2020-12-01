import {
  GET_PUBLIC_JOURNALS,
  DELETE_JOURNAL,
  ADD_JOURNAL,
  GET_JOURNAL,
  GET_JOURNALS,
  JOURNAL_ERROR,
  UPDATE_JOURNAL,
  UPDATE_LIKES,
} from '../actions/types';
const initialState = {
  journals: [],
  journal: null,
  loading: true,
  error: {},
};
export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_PUBLIC_JOURNALS:
    case GET_JOURNALS:
      return {
        ...state,
        journals: payload,
        loading: false,
      };

    case GET_JOURNAL:
      return {
        ...state,
        journal: payload,
        loading: false,
      };
    
    case ADD_JOURNAL:
      return {
        ...state,
        journals:[...state.journals,payload] ,
        loading: false,
      };
    case UPDATE_JOURNAL:
      return {
        ...state,
        journals:state.journals.map(journal=> journal=journal._id===payload._id?payload:journal),
        loading:false,
      };
    case JOURNAL_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };

    case DELETE_JOURNAL:
      return {
        ...state,
        journals: state.journals.filter((journal) => journal._id !== payload),
        loading: false,
      };
    case UPDATE_LIKES:
      return {
        ...state,
        journals: state.journals.map((journal) =>
          journal._id === payload.journalId
            ? { ...journal, likes: payload.likes }
            : journal
        ),
        loading: false,
      };

    default:
      return state;
  }
}

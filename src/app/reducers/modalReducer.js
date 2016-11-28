import {
  SHOW_MODAL,
  CLOSE_MODAL
} from '../actions/types';

const initialState = {
  isVisible: false,
  content: null,
  title: null
}

export default function (state = initialState, action) {
  console.log(action.type, action.payload);
  switch (action.type) {
    case SHOW_MODAL: {
      console.log("SHOW_MODAL");
      return {
        ...state,
        isVisible: true,
        title: action.payload.title,
        content: action.payload.content
      };
    }
    case CLOSE_MODAL: {
      console.log("CLOSE_MODAL");
      return {
        ...state,
        isVisible: false,
        title: null,
        content: null
      };
    }

  }
  return state;
}

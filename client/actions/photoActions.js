/**
 * Application actions and action creators
 */
import {broadcastSwitchPhoto} from '../sync/previewSyncClient.js';

export const REQUEST_PREVIEW = 'REQUEST_PREVIEW';
export function requestPreview(photos, index) {
  return {
    type: REQUEST_PREVIEW,
  };
}

export const RECEIVE_PREVIEW = 'RECEIVE_PREVIEW';
export function receivePreview(photos, index) {
  return {
    type: RECEIVE_PREVIEW,
    photos,
    index,
  };
}

export const NEXT_PHOTO = 'NEXT_PHOTO';
function showNextPhoto() {
  return {
    type: NEXT_PHOTO,
  };
}

export const PREVIOUS_PHOTO = 'PREVIOUS_PHOTO';
function showPreviousPhoto() {
  return {
    type: PREVIOUS_PHOTO,
  };
}

export const SHOW_PHOTO = 'SHOW_PHOTO';
export function showPhoto(index) {
  return {
    type: SHOW_PHOTO,
    index,
  };
}

function hasNextPhoto(state) {
  return state.photoNavigator.currentPhoto <= state.photoNavigator.count - 1;
}

function hasPreviousPhoto(state) {
  return state.photoNavigator.currentPhoto >= 0;
}

function notifyNextPhoto(state) {
  broadcastSwitchPhoto(state.photoNavigator.currentPhoto + 1);
}

function notifyPreviousPhoto(state) {
  broadcastSwitchPhoto(state.photoNavigator.currentPhoto - 1);
}

export function nextPhoto() {
  return (dispatch, getState) => {
    if (hasNextPhoto(getState())) {
      notifyNextPhoto(getState());
      dispatch(showNextPhoto());
    } else {
      return Promise.resolve();
    }
  };
}

export function previousPhoto() {
  return (dispatch, getState) => {
    if (hasPreviousPhoto(getState())) {
      notifyPreviousPhoto(getState());
      dispatch(showPreviousPhoto());
    } else {
      return Promise.resolve();
    }
  };
}
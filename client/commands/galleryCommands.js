/**
 * Application actions and action creators
 */
import app from 'ampersand-app';
import {showThumbnails, showNextPhoto, showPreviousPhoto, showPhoto, requestGallery, receiveGallery} from '../actions/galleryActions.js';

const syncClient = app.syncClient;

function hasNextPhoto(state) {
  return state.navigation.index < state.navigation.count - 1;
}

function hasPreviousPhoto(state) {
  return state.navigation.index >= 0;
}

function isIndexInBounds(state, index) {
  return index >= 0 && index < state.photos.length;
}

function sendPhotoIndex(state) {
  syncClient.sendOpenPhoto(state.navigation.index);
}

export function openThumbnails() {
  return (dispatch) => {
    dispatch(showThumbnails());
    syncClient.onShowThumbnails();
  };
}

export function nextPhoto() {
  return (dispatch, getState) => {
    if (hasNextPhoto(getState())) {
      dispatch(showNextPhoto());
      return dispatch(switchToPhoto(getState().navigation.index));
    } else {
      return Promise.resolve();
    }
  };
}

export function previousPhoto() {
  return (dispatch, getState) => {
    if (hasPreviousPhoto(getState())) {
      dispatch(showPreviousPhoto());
      return dispatch(switchToPhoto(getState().navigation.index));
    } else {
      return Promise.resolve();
    }
  };
}

export function switchToPhoto(index) {
  return (dispatch, getState) => {
    if (isIndexInBounds(getState(), index)) {
      dispatch(showPhoto(index));
      sendPhotoIndex(getState());
    } else {
      return Promise.resolve();
    }
  };
}

export function initializeGallery() {
  return (dispatch) => {
    dispatch(requestGallery());

    return syncClient.loadGallery()
      .then(data => dispatch(receiveGallery(data)))
      .catch(err => console.error(err));
  };
}

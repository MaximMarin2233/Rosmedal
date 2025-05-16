import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { IWindowSize } from "../../types/windowSize";

interface IMainState {
  currentPage: number;
  windowSize: IWindowSize;
  activeLink: number;
  isNoScroll: boolean;
  isNavActive: boolean;
}

const initialState: IMainState = {
  currentPage: 0,
  windowSize: {
    innerWidth: 1920,
    innerHeight: 1080,
  } as IWindowSize,
  activeLink: 0,
  isNoScroll: false,
  isNavActive: false,
};

export const mainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    setCurrentPage(state, action: PayloadAction<number>) {
      state.isNavActive = false;
      state.isNoScroll = false;
      state.currentPage = action.payload;
    },
    setWindowSize(state, action: PayloadAction<IWindowSize>) {
      state.windowSize = action.payload;
    },
    setActiveLink(state, action: PayloadAction<number>) {
      state.activeLink = action.payload;
    },
    setIsNavActive(state, action: PayloadAction<boolean>) {
      state.isNavActive = action.payload;
      state.isNoScroll = action.payload;
    },
  },
});

export const { actions, reducer } = mainSlice;

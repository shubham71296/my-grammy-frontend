import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    dialog: {
      openDialog: false,
      selectedData: {},
      dialogInfo: {
        title: '',
        content: '',
        check: ''
      }
    },
    renderTable: false
  },
  reducers: {
    openDialogAction: (state, action) => {
      state.dialog.openDialog = action.payload.openDialog;
      state.dialog.selectedData = action.payload.selectedData;
      state.dialog.dialogInfo = action.payload.dialogInfo || state.dialogInfo;
    },
    closeDialog: (state, action) => {
      state.dialog.openDialog = false;
      state.dialog.dialogInfo = { title: '', content: '', check: '', previewUrl: '', previewTitle: '' };
      state.dialog.selectedData = {};
    },
    renderTableAction: (state, action) => {
      state.renderTable = action.payload.renderTable
    }
  }
});

export const { openDialogAction, closeDialog, renderTableAction } = uiSlice.actions;
export default uiSlice.reducer;

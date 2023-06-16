import { createSelector } from 'reselect';

const selectConfig = (state) => state.config;

export const selectOffice = createSelector(
  [selectConfig],
  (config) => config.office
);

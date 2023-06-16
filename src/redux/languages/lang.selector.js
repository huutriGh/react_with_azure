import { createSelector } from 'reselect';

const selectLanguage = (state) => state.lang;

export const selectCurrentLang = createSelector(
  [selectLanguage],
  (lang) => lang.languages
);

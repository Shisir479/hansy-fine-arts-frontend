import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { toggleTheme, setTheme } from '@/lib/redux/slices/themeSlice';

export const useTheme = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.mode);

  const toggle = () => dispatch(toggleTheme());
  const set = (mode: 'light' | 'dark') => dispatch(setTheme(mode));

  return { theme, toggle, set };
};

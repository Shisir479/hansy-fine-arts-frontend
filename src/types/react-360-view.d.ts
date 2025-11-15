declare module 'react-360-view' {
  import { FC } from 'react';

  interface ThreeSixtyProps {
    amount: number;
    imagePath: string;
    fileName: string;
    autoplay?: boolean;
    spinReverse?: boolean;
    buttonClass?: string;
    width?: number | string;
    height?: number | string;
  }

  const ThreeSixty: FC<ThreeSixtyProps>;
  export default ThreeSixty;
}

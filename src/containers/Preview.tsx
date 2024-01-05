import React from "react";
import styles from "../styles/Preview.module.scss";

const { wrapper } = styles;

interface Props {
  translatedCode: string;
}

const Preview: React.FC<Props> = ({ translatedCode }) => {
  return <div className={wrapper}>{translatedCode}</div>;
};

export default Preview;

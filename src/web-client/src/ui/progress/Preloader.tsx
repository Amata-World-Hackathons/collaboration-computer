import classNames from "classnames";

import styles from "./Preloader.module.css";

export const Preloader: React.FC<React.HTMLAttributes<HTMLDivElement>> = (
  props
) => {
  return (
    <div className="fixed inset-0 bg-slate-800 flex flex-col items-center justify-center">
      <div className={classNames(styles["mosaic-loader"], props.className)}>
        <div className={classNames(styles["cell"], styles["d-0"])} />
        <div className={classNames(styles["cell"], styles["d-1"])} />
        <div className={classNames(styles["cell"], styles["d-2"])} />
        <div className={classNames(styles["cell"], styles["d-3"])} />

        <div className={classNames(styles["cell"], styles["d-1"])} />
        <div className={classNames(styles["cell"], styles["d-2"])} />
        <div className={classNames(styles["cell"], styles["d-3"])} />
        <div className={classNames(styles["cell"], styles["d-4"])} />

        <div className={classNames(styles["cell"], styles["d-2"])} />
        <div className={classNames(styles["cell"], styles["d-3"])} />
        <div className={classNames(styles["cell"], styles["d-4"])} />
        <div className={classNames(styles["cell"], styles["d-5"])} />

        <div className={classNames(styles["cell"], styles["d-3"])} />
        <div className={classNames(styles["cell"], styles["d-4"])} />
        <div className={classNames(styles["cell"], styles["d-5"])} />
        <div className={classNames(styles["cell"], styles["d-6"])} />
      </div>
      <span className="mt-4">Loading...</span>
    </div>
  );
};

import type { FC } from 'react';
import styles from './ErrorFallback.module.css';

interface Props {
  error: Error;
}

export const ErrorFallback: FC<Props> = ({ error }) => {
  return (
    <div className={styles.container}>
      <h2>Something went wrong</h2>
      <p>Please try refreshing the page or contact support if the problem persists.</p>
      {process.env.NODE_ENV === 'development' && (
        <pre className={styles.errorDetails}>
          {error.message}
          {'\n'}
          {error.stack}
        </pre>
      )}
    </div>
  );
};
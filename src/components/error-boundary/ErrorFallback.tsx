import React from 'react';
import styles from './ErrorFallback.module.css';

const ErrorFallback: React.FC = () => {
  return (
    <div className={styles.container}>
      <h2>Something went wrong</h2>
      <p>Please try refreshing the page or contact support if the problem persists.</p>
    </div>
  );
};

export default ErrorFallback;
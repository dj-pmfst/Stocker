import { useState } from 'react';
import Layout from '../../components/Layout'; //popravit importe 


export default function Scan() {

  return (
    <Layout>
      <div className={styles.container}>
        <p className={styles.pageTitle}>
          {state === 'camera' ? 'SCAN' : 'SCAN FEEDBACK'}
        </p>

        {state === 'camera'   && <ScanCamera onScan={handleScan} />}
        {state === 'loading'  && <ScanLoading />}
        {state === 'feedback' && <ScanFeedback />}
      </div>
    </Layout>
  );
}

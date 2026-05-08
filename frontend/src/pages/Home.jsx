import { useState } from 'react';
import Layout from '../components/Layout';

export default function Home() {
  const [query, setQuery] = useState('');
  const [itemFound, setItemFound] = useState(false);

  return (
    <Layout>
    </Layout>
  );
}

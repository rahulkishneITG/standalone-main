import { useState, useEffect } from 'react';
import { Autocomplete, TextField } from '@shopify/polaris';
import { searchProducts } from '../../../api/ProductApi.js';
import useEventStore from '../../../store/CreateEventStore.js';

const ProductSearch = () => {
    const [input, setInput] = useState('');
    const [options, setOptions] = useState([]);
    const { eventData, setField } = useEventStore();
  
    useEffect(() => {
      const fetch = async () => {
        const res = await searchProducts(input);
        setOptions(res.map((p) => ({ value: p.id, label: p.title })));
      };
      if (input) fetch();
    }, [input]);
  
    return (
      <Autocomplete
        options={options}
        selected={eventData.product ? [eventData.product] : []}
        onSelect={([selected]) => setField('product', selected)}
        textField={<TextField label="Search Product" value={input} onChange={setInput} autoComplete="off" />}
      />
    );
  };
  
  export default ProductSearch;
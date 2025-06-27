import { Autocomplete, Icon, Spinner, Text } from '@shopify/polaris';
import { SearchIcon } from '@shopify/polaris-icons';
import { useState, useCallback, useEffect } from 'react';
import useProductStore from '../../../store/productStore.js';

export default function ProductSearch({error}) {
  const [inputValue, setInputValue] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);

  const {
    searchResults,
    searchProducts,
    loading,
    setSelectedProduct,
  } = useProductStore();

  useEffect(() => {
    const delay = setTimeout(() => {
      if (inputValue.length >= 2) {
        searchProducts(inputValue);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [inputValue]);

  const updateText = useCallback((value) => {
    setInputValue(value);
  }, []);

  const updateSelection = useCallback(
    (selected) => {
      setSelectedOptions(selected);
      const selectedValue = searchResults.find((option) => option.value === selected[0]);
      if (selectedValue) {
        setInputValue(selectedValue.label);
        setSelectedProduct(selectedValue);
      }
    },
    [searchResults]
  );

  const textField = (
    <Autocomplete.TextField
      onChange={updateText}
      value={inputValue}
      prefix={loading ? <Spinner size="small" /> : <Icon source={SearchIcon} tone="base" />}
      placeholder="Search by name or SKU"
      autoComplete="off"
      name='Product is required'
      error={error}
    />
  );

  const optionsSection = [
    {
      options: searchResults,
    },
  ];

  return (
    <div style={{ height: 'auto' }}>
      <Autocomplete
        options={optionsSection}
        selected={selectedOptions}
        onSelect={updateSelection}
        textField={textField}
        listTitle="Matching Products"
        loading={loading}
      />
      {error && (
        <Text variant="bodySm" color="critical">
          {error}
        </Text>
      )}
    </div>
  );
}

import { Autocomplete, Icon, Spinner } from '@shopify/polaris';
import { SearchIcon } from '@shopify/polaris-icons';
import {
  useState,
  useCallback,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import useProductStore from '../../../store/productStore.js';

const ProductSearch = forwardRef(({ error, onProductSelect }, ref) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);

  const {
    searchResults,
    searchProducts,
    loading,
    setSelectedProduct,
  } = useProductStore();


  useImperativeHandle(ref, () => ({
    clear: () => {
      setInputValue('');
      setSelectedOptions([]);
      setSelectedProduct(null);
    },
    setSelectedProductManually: (product) => {
      setInputValue(product.label);
      setSelectedOptions([product.value]);
      setSelectedProduct(product);
    },
  }));

  useEffect(() => {
    const delay = setTimeout(() => {
      if (inputValue.length >= 2) {
        searchProducts(inputValue);
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [inputValue]);

  const updateText = useCallback((val) => {
    setInputValue(val);
  }, []);

  const updateSelection = useCallback(
    (selected) => {
      setSelectedOptions(selected);
      const selectedValue = searchResults.find((option) => option.value === selected[0]);
      if (selectedValue) {
        setInputValue(selectedValue.label);
        setSelectedProduct(selectedValue);
        if (onProductSelect) {
          onProductSelect(selectedValue);
        }
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
      error={error}
      clearButton
      onClearButtonClick={() => {
        setInputValue('');
        setSelectedOptions([]);
        setSelectedProduct(null);
      }}
    />
  );

  return (
    <div style={{ height: 'auto' }}>
      <Autocomplete
        options={[{ options: searchResults }]}
        selected={selectedOptions}
        onSelect={updateSelection}
        textField={textField}
        listTitle="Matching Products"
        loading={loading}
      />
    </div>
  );
});

export default ProductSearch;

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';

const API_KEY = '028df21732ab46048f7530ac18363498';
const BASE_URL = `https://openexchangerates.org/api/latest.json?app_id=${API_KEY}`;

const App = () => {
  const [currencies, setCurrencies] = useState([]);
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('TRY');
  const [amount, setAmount] = useState('');
  const [convertedAmount, setConvertedAmount] = useState('');

  const [conversionDate, setConversionDate] = useState('');
  const [conversionTime, setConversionTime] = useState('');


  

  useEffect(() => {
    getCurrencies();
  }, []);

  const getCurrencies = async () => {
    try {
      const response = await axios.get(BASE_URL);
      const data = response.data;
      const base = data.base;
      const rates = data.rates;

      const currenciesData = [base, ...Object.keys(rates)];

      setCurrencies(currenciesData);
    } catch (error) {
      console.error(error);
    }
  };

  const convertCurrency = async () => {
    try {
      const response = await axios.get(`${BASE_URL}&base=${baseCurrency}`);
      const data = response.data;

      const rate = data.rates[targetCurrency];

      if (rate) {
        // Dönüştürülen miktarı hesaplama
        const converted = amount * rate;

        setConvertedAmount(converted.toFixed(2));
        setConversionDate(new Date().toLocaleDateString());
        setConversionTime(new Date().toLocaleTimeString());
      } else {
        Alert.alert('Uyarı!', 'Dönüşüm birimi Bulunamadı.');      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Baz Para Birimi:</Text>
      <TextInput
        style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
        onChangeText={setBaseCurrency}
        value={baseCurrency}
      />
      <Text>Hedef Para Birimi:</Text>
      <TextInput
        style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
        onChangeText={setTargetCurrency}
        value={targetCurrency}
      />
      <Text>Miktar:</Text>
      <TextInput
        style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
        onChangeText={setAmount}
        value={amount}
        keyboardType="numeric"
      />
      <Button title="Dönüştür" onPress={convertCurrency} />
      {convertedAmount ? (
        <>
        <Text>{`${amount} ${baseCurrency} = ${convertedAmount} ${targetCurrency}`}</Text>
        <Text>{`Dönüştürülen Tarih: ${conversionDate}`}</Text>
        <Text>{`Dönüştürülen Saat: ${conversionTime}`}</Text>
        </>
) : null}

    </View>
  );
};

export default App;
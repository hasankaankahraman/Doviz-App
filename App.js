import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert,StyleSheet,Dimensions,Image,TouchableOpacity} from 'react-native';
import axios from 'axios';
import moment from 'moment';

const { height, width } = Dimensions.get('window');

const API_KEY = '80a5ab68366c487cb48f5f3e955b7f0';
const BASE_URL = `https://openexchangerates.org/api/latest.json?app_id=${API_KEY}`;

const App = () => {
  const [currencies, setCurrencies] = useState([]);
  const [baseCurrency, setBaseCurrency] = useState('EUR');
  const [targetCurrency, setTargetCurrency] = useState('USD');
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
      console.log(response)
    } catch (error) {
      console.error(error);
    }
  };



  const currentDate = new Date();
  const options = { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false, timeZone: 'Asia/Istanbul' };
  const formattedTime = new Intl.DateTimeFormat('tr-TR', options).format(currentDate); // Telefon Saatinden bağımsız Türkiye saatini alıyor.


  const convertCurrency = async () => {
    try {
      const response = await axios.get(`${BASE_URL}&base=${baseCurrency}`);
      const data = response.data;

      const rate = data.rates[targetCurrency];

      if (rate) {
        // Dönüştürülen miktarı hesaplama
        const converted = amount * rate;

        setConvertedAmount(converted.toFixed(2));
        setConversionDate(moment().format('DD-MM-YYYY'));
        // setConversionTime(moment().format('HH:mm:ss'));
        setConversionTime(formattedTime);
      } else {
        Alert.alert('Uyarı!', 'Dönüşüm birimi bulunamadı.');      }
    } catch (error) {
      console.error(error);
    }
  };

  const swapCurrencies = () => {
    const temp = baseCurrency;
    setBaseCurrency(targetCurrency);
    setTargetCurrency(temp);
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoview}>
        <Image style={styles.logo} source={require('./ctc.png')}/>
        <Text style={styles.title}>DÖVİZ ÇEVİRİCİ</Text>
      </View>
      <Text style={styles.inputlabel}>Baz Para Birimi:</Text>
      <TextInput
        style={styles.input}
        onChangeText={setBaseCurrency}
        value={baseCurrency} // inputun içindeki değeri gösteriyor.
      />
      <Text style={styles.inputlabel}>Hedef Para Birimi:</Text>
      <TextInput
        style={styles.input}
        onChangeText={setTargetCurrency}
        value={targetCurrency} // inputun içindeki değeri gösteriyor.
      />
      <Text style={styles.inputlabel}>Miktar:</Text>
      <TextInput
        style={styles.input}
        onChangeText={setAmount}
        value={amount} // inputun içindeki değeri gösteriyor.
        keyboardType="numeric"
      />
      <Button title="Swap" onPress={swapCurrencies} />
      <Button color='#ed1d4e' title="Dönüştür" onPress={convertCurrency} />
      {convertedAmount ? (
        <>
        <Text style={styles.inputlabel}>{`${amount} ${baseCurrency} = ${convertedAmount} ${targetCurrency}`}</Text>
        <Text style={styles.inputlabel}>{`Dönüştürülen Tarih: ${conversionDate}`}</Text>
        <Text style={styles.inputlabel}>{`Dönüştürülen Saat: ${conversionTime}`}</Text>
        </>
      ) : null}
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container:{
    // eğer flex:1 yaparsan klavye açıldığında ekran yukarı kayıyor.
    // height:height,
    // width:width,
    flex:3*height/4,
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor:'#fff'

  },
  title:{
    fontWeight:'bold',
    color:'#ed1d4e',
    textAlign:'center',
    fontSize:20,
  },
  logoview:{
    borderWidth:0,
    marginBottom:10
  },
  logo:{
    height:height/6,
    width:width/1.5,
  },
  inputlabel:{
    color:'#ed1d4e',
    fontWeight:'bold',
  },
  input:{
    height:40, 
    width:200, 
    borderColor:'#ed1d4e', 
    borderWidth:1, 
    marginBottom:10,
    borderRadius:10,

  },
})

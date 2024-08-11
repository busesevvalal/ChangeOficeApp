import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from "react-native";
import Header from "./components/Header";
import CurrencyInput from "./components/CurrencyInput";
import CurrencyPicker from "./components/CurrencyPicker";
import SearchInput from "./components/SearchInput";
import Footer from "./components/footer";

// Main App Component
export default function App() {
  const [selectCurrency, setSelectCurrency] = useState("TRY");
  const [currencyList, setCurrencyList] = useState([]);
  const [amount, setAmount] = useState("1");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCurrencyList, setFilteredCurrencyList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  useEffect(() => {
    getData();
  }, [selectCurrency]);

  useEffect(() => {
    filterCurrencyList();
  }, [searchQuery, currencyList]);

  const getData = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await fetch(
        `https://api.coinbase.com/v2/exchange-rates?currency=${selectCurrency}`
      );
      const data = await response.json();
      const mostUsedCurrencies = [
        "USD",
        "EUR",
        "GBP",
        "CHF",
        "JPY",
        "CNY",
        "RUB",
        "CAD",
        "AUD",
        "SEK",
        "NOK",
        "DKK",
        "SGD",
        "HKD",
        "AED",
      ];
      setCurrencyList(
        Object.entries(data.data.rates)
          .filter(([key]) => mostUsedCurrencies.includes(key))
          .map(([key, value]) => ({
            label: key,
            value: parseFloat(value).toFixed(2),
          }))
          .sort(
            (a, b) =>
              mostUsedCurrencies.indexOf(a.label) -
              mostUsedCurrencies.indexOf(b.label)
          )
      );
    } catch (error) {
      setIsError(true);
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  };

  const filterCurrencyList = () => {
    const query = searchQuery.toLowerCase();
    setFilteredCurrencyList(
      currencyList.filter((item) => item.label.toLowerCase().includes(query))
    );
  };

  const calculateAmount = (value) => {
    return (parseFloat(value) * (amount || 1)).toFixed(2);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header />
      <View style={styles.content}>
        <View style={styles.formContainer}>
          <CurrencyInput amount={amount} setAmount={setAmount} />
          <CurrencyPicker
            selectCurrency={selectCurrency}
            setSelectCurrency={setSelectCurrency}
          />
        </View>
        <Text style={styles.listHeaderText}>Dönüştürülen Para Birimleri:</Text>
        <ScrollView style={styles.scrollView}>
          {!isLoading && !isError && (
            <SearchInput
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          )}
          {isLoading && <Text>Yükleniyor...</Text>}
          {isError && <Text>Bir hata oluştu...</Text>}
          {!isLoading &&
            !isError &&
            filteredCurrencyList.map((item, index) => (
              <View key={index} style={styles.currencyItem}>
                <Text style={styles.currencyText}>
                  {item.label} - {calculateAmount(item.value)}
                </Text>
              </View>
            ))}
        </ScrollView>
      </View>
      <Footer />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdfdfd",
  },
  content: {
    flex: 1,
  },
  formContainer: {
    flexDirection: "row",
    margin: 25,
    gap: 10,
  },
  scrollView: {
    marginHorizontal: 25,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  listHeaderText: {
    marginHorizontal: 25,
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  currencyItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  currencyText: {
    fontSize: 18,
  },
});
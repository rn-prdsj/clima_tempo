import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from 'react-native';

import {Card, Divider} from 'react-native-elements';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import * as env from './services/pageBase';
import ThemeContext from './context/ThemeContext';

function App() {
  const themeHook = useState('dark');
  const [darkTheme, setDarkTheme] = useState(true);
  const [location, setLocation] = useState(false);
  const [weather, setWeather] = useState(false);
  const [loading, setLoading] = useState(false);
  const kilometers = 'km/hs';

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: darkTheme ? '#F2F2F2' : '#8F8F8F',
    },
    card: {
      backgroundColor: darkTheme ? '#8F8F8F' : '#000',
      borderWidth: 0,
      borderRadius: 15,
      shadowColor: darkTheme ? '#FFF' : '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    time: {
      fontSize: 38,
      color: darkTheme ? '#000' : '#FFF',
      fontWeight: 'bold',
    },
    notes: {
      fontSize: 18,
      color: darkTheme ? '#000' : '#FFF',
      fontWeight: 'bold',
      textTransform: 'capitalize',
    },
    themeButtonCircle: {
      alignSelf: darkTheme ? 'flex-end' : 'flex-start',
      margin: 5,
      width: 20,
      height: 20,
      borderRadius: 50,
      backgroundColor: darkTheme ? '#F2F2F2' : '#8F8F8F',
    },
    themeButton: {
      marginLeft: 355,
      alignItems: 'center',
      justifyContent: 'center',
      width: 50,
      height: 50,
      borderRadius: 25,
    },
    themeButtonSquare: {
      backgroundColor: darkTheme ? '#8F8F8F' : '#F2F2F2',
      justifyContent: 'center',
      borderRadius: 20,
      marginRight: 20,
      width: 50,
      height: 25,
      shadowColor: darkTheme ? '#FFF' : '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    buttonUpdate: {
      height: 45,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 15,
      marginRight: 15,
      marginLeft: 15,
      marginTop: 25,
      backgroundColor: darkTheme ? '#8F8F8F' : '#F2F2F2',
      shadowColor: darkTheme ? '#FFF' : '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    textUpdate: {
      color: darkTheme ? '#F2F2F2' : '#8F8F8F',
      fontSize: 20,
      fontWeight: 'bold',
    },
    loading: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    textPermission: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    weatherForecast: {
      fontSize: 20,
      fontWeight: 'bold',
      color: darkTheme ? '#8F8F8F' : '#F2F2F2',
    },
    header: {
      justifyContent: 'center',
      alignItems: 'center',
      height: 50,
      backgroundColor: darkTheme ? '#F2F2F2' : '#8F8F8F',
    },
    containerNotes: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    divider: {
      backgroundColor: darkTheme ? '#000' : '#F2F2F2',
      marginVertical: 25,
    },
    viewImage: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    image: {
      width: 66,
      height: 58,
    },
    viewDescription: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    viewNotes: {
      alignItems: 'flex-end',
    },
  });

  async function setCurrentWeather() {
    await Geolocation.getCurrentPosition((position) => {
      getWeather(position.coords.latitude, position.coords.longitude);
      setLocation(true);
    });
  }

  useEffect(() => {
    setCurrentWeather();
  }, []);

  let getWeather = async (lat, long) => {
    setLoading(true);
    let response = await axios.get(env.BASE_URL, {
      params: {
        lat: lat,
        lon: long,
        appid: env.API_KEY,
        lang: env.LANG,
        units: env.UNITS,
      },
    });
    setWeather(response.data);
    setLoading(false);
  };

  function dateBuilder(d) {
    let months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    let days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day}, ${date} ${month} ${year}`;
  }

  if (location == false) {
    return (
      <>
        <View style={styles.textPermission}>
          <Text>Você precisa habilitar a localização do seu aparelho</Text>
        </View>
      </>
    );
  } else if (weather == false && loading) {
    return (
      <>
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#111" />
        </View>
      </>
    );
  } else {
    return (
      <>
        <ThemeContext.Provider value={themeHook}>
          <StatusBar barStyle="light-content" backgroundColor="#8F8F8F" />
          <View style={styles.header}>
            <Text style={styles.weatherForecast}>Weather Forecast</Text>
          </View>
          <View style={styles.container}>
            <View style={styles.themeButton}>
              <View style={styles.themeButtonSquare}>
                <TouchableOpacity
                  style={styles.themeButtonCircle}
                  onPress={() =>
                    darkTheme ? setDarkTheme(false) : setDarkTheme(true)
                  }></TouchableOpacity>
              </View>
            </View>
            <Card containerStyle={styles.card}>
              <Text style={styles.notes}>
                Weather in {weather['name']}, {weather['sys']['country']}
              </Text>
              <View style={styles.viewImage}>
                <Image
                  style={styles.image}
                  source={{
                    uri: `${env.BASE_URL_ICONS}${weather['weather'][0]['icon']}.png`,
                  }}
                />
                <Text style={styles.time}>
                  {Math.round(weather['main']['temp'] * 10) / 10} &#8451;
                </Text>
              </View>
              <View style={styles.viewDescription}>
                <Text style={styles.notes}>
                  {weather['weather'][0]['description']}
                </Text>
                <Text style={styles.notes}>
                  {Math.round(weather['main']['temp_max'] * 10) / 10} &#186; /{' '}
                  {Math.round(weather['main']['temp_min'] * 10) / 10} &#186;
                </Text>
              </View>

              <Divider style={styles.divider} />

              <View style={styles.viewNotes}>
                <Text style={styles.notes}>
                  Pressure: {weather['main']['pressure']} hpa
                </Text>
              </View>
              <View style={styles.viewNotes}>
                <Text style={styles.notes}>
                  Humidity: {weather['main']['humidity']}&#x0025;
                </Text>
              </View>
              <View style={styles.viewNotes}>
                <Text style={styles.notes}>
                  Wind: {Math.round(weather['wind']['speed'] * 3.6)}{' '}
                  {kilometers.toUpperCase()}, ( {weather['wind']['deg']} )
                </Text>
              </View>
              <View style={styles.viewNotes}>
                <Text style={styles.notes}>
                  Coord: {weather['coord']['lon']} | {weather['coord']['lat']}
                </Text>
              </View>
              <View style={styles.viewNotes}>
                <Text style={styles.notes}>{dateBuilder(new Date())}</Text>
              </View>
            </Card>
            <TouchableOpacity
              style={styles.buttonUpdate}
              onPress={() => setCurrentWeather()}>
              <Text style={styles.textUpdate}>Update</Text>
            </TouchableOpacity>
          </View>
        </ThemeContext.Provider>
      </>
    );
  }
}

export default App;

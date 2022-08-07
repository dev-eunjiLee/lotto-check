import { StyleSheet, Text, View } from "react-native";
import * as Location from "expo-location";
import { useEffect, useState } from "react";

let renderCnt = 0;

export default function App() {
  console.log(`render cnt: ${renderCnt}`);
  renderCnt++;
  const questionMarkLocation = "???";
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<{
    city: string;
    district: string;
  }>({ city: questionMarkLocation, district: questionMarkLocation });
  const ask = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    setLocationPermission(granted);
  };
  const getUserLocation = async (locationPermission: boolean) => {
    console.log(`locationPermission: ${locationPermission}`);
    if (locationPermission) {
      const {
        coords: { longitude, latitude },
      } = await Location.getCurrentPositionAsync();
      const [{ city, district }] = await Location.reverseGeocodeAsync({
        longitude,
        latitude,
      });
      setUserLocation({
        city: city || questionMarkLocation,
        district: district || questionMarkLocation,
      });
    } else {
      setUserLocation({
        city: questionMarkLocation,
        district: questionMarkLocation,
      });
    }
  };
  // * ===== useEffect ===== * //
  // 권한 요청 => useEffect의 2번째 파라미터를 빈 배열로 하면 처음 렌더링 될 때 사용된다
  useEffect(() => {
    console.log(`call ask`);
    (async () => {
      await ask();
      await getUserLocation(locationPermission);
    })();
  }, []);
  // 유저 위치값 가져오기(locationPermission 이 true 될 때)
  useEffect(() => {
    console.log(`call getUserLocation`);
    (async () => {
      await getUserLocation(locationPermission);
    })();
  }, [locationPermission]);

  // * ===== return ===== * //
  return (
    <View style={styles_layout.container}>
      <View style={styles_layout.header}>
        <Text style={styles_text.header_title}>오늘의 로또</Text>
      </View>

      <View style={styles_layout.body}>
        <View style={styles_layout.body_userLocation}>
          <Text style={styles_text.body_userLocation}>
            {`${userLocation.city} - ${userLocation.district}`}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles_layout = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fcba03",
  },
  header: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    flex: 1,
    alignItems: "center",
    alignContent: "center",
  },
  body_userLocation: {
    flex: 1,
    alignItems: "center",
    alignContent: "center",
  },
});

const styles_text = StyleSheet.create({
  header_title: {
    fontSize: 50,
    fontWeight: "bold",
    alignContent: "center",
  },
  body_content: {
    fontSize: 20,
    alignContent: "center",
  },
  body_userLocation: {
    fontSize: 30,
    fontWeight: "100",
    alignContent: "center",
  },
});

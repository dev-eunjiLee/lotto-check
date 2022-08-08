import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import * as Location from "expo-location";
import { useEffect, useState } from "react";

let renderCnt = 0;

export class LocationType {
  city: string;
  district: string;
}

export default function App() {
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<LocationType>();
  // * ===== 기타 함수 ===== * //
  // * 위치 정보 사용해도 되는지 물어보기
  const ask = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    setLocationPermission(granted);
  };
  // * 위치 정보 가져오기
  const getUserLocation = async (locationPermission: boolean) => {
    if (locationPermission) {
      const {
        coords: { longitude, latitude },
      } = await Location.getCurrentPositionAsync();
      console.log(longitude, latitude);
      const [{ city, district }] = await Location.reverseGeocodeAsync({
        longitude,
        latitude,
      });
      if (city && district) {
        setUserLocation({
          city,
          district,
        });
      }
    }
  };
  // * 주소를 기반으로 로또 판매점 가져오기
  const getLottoStoreList = async (userLocation?: LocationType) => {
    console.log(userLocation);
    const API_KEY = "09062df488493f65510e46700fa97428";

    try {
      const formData = new FormData();
      formData.append("searchType", "2");
      formData.append("kind", "1");
      formData.append("srchval", "가좌동");
      // fetch 참고 링크: https://stackoverflow.com/questions/47438466/react-native-fetch-returns-error-json-unexpected-eof
      const response = fetch(
        "https://dhlottery.co.kr/store.do?method=sellerInfo645Result",
        {
          method: "POST",
          headers: {
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          },

          body: formData,
          mode: "cors",
          credentials: "include",
        }
      ).then((res) => {
        console.log(JSON.stringify(res, null, 4));
        return res.json();
      });
    } catch (error) {
      console.log(error);
    }
  };

  // * ===== useEffect ===== * //
  // 권한 요청 => useEffect의 2번째 파라미터를 빈 배열로 하면 처음 렌더링 될 때 사용된다
  useEffect(() => {
    (async () => {
      await ask();
      await getUserLocation(locationPermission);
    })();
  }, []);
  // 유저 위치값 가져오기(locationPermission 이 true 될 때)
  useEffect(() => {
    (async () => {
      await getUserLocation(locationPermission);
    })();
  }, [locationPermission]);
  // 유저 위치를 기반으로 복권 판매점 데이터 가져오기
  useEffect(() => {
    (async () => {
      await getLottoStoreList(userLocation);
    })();
  }, [userLocation]);

  // * ===== return ===== * //
  return (
    <View style={styles_layout.container}>
      <View style={styles_layout.header}>
        <Text style={styles_text.header_title}>오늘의 로또</Text>
      </View>
      <View style={styles_layout.body}>
        {userLocation === undefined ? (
          <ActivityIndicator></ActivityIndicator>
        ) : (
          <View style={styles_layout.body_userLocation}>
            <Text style={styles_text.body_userLocation}>
              {`${userLocation.city} - ${userLocation.district}`}
            </Text>
          </View>
        )}
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

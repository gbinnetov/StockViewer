import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useLayoutEffect } from "react";
import { FlatList } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function GoodsDetail({ route }) {
  const navigation = useNavigation();

  const productInfo = route.params.productInfo;
  const productStock = route.params.productStock;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="arrow-back"
            size={24}
            color="black"
            style={styles.backIcon}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.label}>Mal Adi</Text>
        <View style={styles.horizontalStack}>
          <Text style={styles.text}>{productInfo.c1}</Text>
          <Text style={styles.text}>{productInfo.c2}</Text>
        </View>

        <Text style={styles.text} name="C3">
          {productInfo.c3}
        </Text>

        <Text style={styles.label}>Option Code</Text>
        <Text style={styles.text} name="C4">
          {productInfo.c4}
        </Text>

        <Text style={styles.label}>Ürün kodu</Text>
        <Text style={styles.text} name="C5">
          {productInfo.c5}
        </Text>

        <Text style={styles.label}>Group</Text>
        <View style={styles.horizontalStack}>
          <Text style={styles.text}>{productInfo.c6}</Text>
          <Text style={styles.text}> - </Text>
          <Text style={styles.text}>{productInfo.c7}</Text>
        </View>

        <Text style={styles.label}>Reng</Text>
        <View style={styles.horizontalStack}>
          <Text style={styles.text}>{productInfo.c8}</Text>
          <Text style={styles.text}> - </Text>
          <Text style={styles.text}>{productInfo.c9}</Text>
        </View>

        <Text style={styles.label}>Diger</Text>
        <Text style={styles.text}>{productInfo.c10}</Text>
        <Text style={styles.text}>{productInfo.c11}</Text>
        <Text style={styles.text}>{productInfo.c12}</Text>
      </View>
      <FlatList
        data={productStock}
        keyExtractor={(item) => item.depoID.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.text}>{item.sC1}</Text>
            <Text style={styles.text}>{item.sC2}</Text>
            <Text style={styles.text}>{item.sC3}</Text>
            <View style={styles.horizontalStack}>
              <Text style={styles.text}>{item.sC4}</Text>
              <Text style={styles.text}>{item.sC5}</Text>
            </View>
            <Text style={styles.text}>{item.sC6}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: "white",
      flex: 1,
    },
    backIcon: {
        padding: 15,
      },
    label: {
      fontSize: 14,
      fontStyle: "italic",
      color: "gray",
      marginBottom: 5,
    },
    text: {
      fontSize: 17,
      fontWeight: "bold",
      color: "black",
      marginBottom: 5,
      marginLeft: 5,
    },
    horizontalStack: {
      flexDirection: "row",
      alignItems: "center",
    },
    item: {
      marginVertical: 5,
      padding: 10,
      backgroundColor: "lightgray",
      borderRadius: 7,
      marginVertical: 5,
    },
  });
  
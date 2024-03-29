import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Button,
  FlatList,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import DropDownPicker from "react-native-dropdown-picker";
import RepStocServices from "../api/services/RepStocServices";
import RepStockFilterServices from "../api/services/RepStockFilterServices";
import RepStockDetailServices from "../api/services/RepStockDetailServices";
import { getStorageData, storeData } from "../StorageUtil";
import { TextInput } from "react-native";

export default function GoodsInformation() {
  const [isOpenProductGroup, setIsOpenProductGroup] = useState(false);
  const [isOpenProductSubgroup, setIsOpenProductSubgroup] = useState(false);
  const [isOpenProductSize, setIsOpenProductSize] = useState(false);
  const [isOpenProductType, setIsOpenProductType] = useState(false);
  const [isOpenProductSeason, setIsOpenProductSeason] = useState(false);
  const [isOpenProductColor, setIsOpenProductColor] = useState(false);
  const [isOpenProductColorTheme, setIsOpenProductColorTheme] = useState(false);
  const [isOpenProductThema, setIsOpenProductThema] = useState(false);

  const [itemsProductGroup, setItemsProductGroup] = useState([
    { label: "", value: 0, groupName: "" },
  ]);
  const [itemsProductSubgroup, setItemsProductSubgroup] = useState([
    { label: "", value: 0, groupName: "" },
  ]);
  const [itemsProductSize, setItemsProductSize] = useState([
    { label: "", value: 0, groupName: "" },
  ]);
  const [itemsProductType, setItemsProductType] = useState([
    { label: "", value: 0, groupName: "" },
  ]);
  const [itemsProductSeason, setItemsProductSeason] = useState([
    { label: "", value: 0, groupName: "" },
  ]);
  const [itemsProductColor, setItemsProductColor] = useState([
    { label: "", value: 0, groupName: "" },
  ]);
  const [itemsProductColorTheme, setItemsProductColorTheme] = useState([
    { label: "", value: 0, groupName: "" },
  ]);
  const [itemsProductThema, setItemsProductThema] = useState([
    { label: "", value: 0, groupName: "" },
  ]);
  const [productCode, setProductCode] = useState("");

  const [productGroup, setProductGroup] = useState([]);
  const [productSubgroup, setProductSubgroup] = useState([]);
  const [productSize, setProductSize] = useState([]);
  const [productType, setProductType] = useState([]);
  const [productSeason, setProductSeason] = useState([]);
  const [productColor, setProductColor] = useState([]);
  const [productColorTheme, setProductColorTheme] = useState([]);
  const [productThema, setProductThema] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [ProductAboutDataSource, setProductAboutDataSource] = useState([]);
  const [isListEnd, setIsListEnd] = useState(false);
  const [storegeToken, setStoregeToken] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalProductAboutVisible, setIsModalProductAboutVisible] =
    useState(false);
  const navigation = useNavigation();

  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fechStorage = async () => {
      const storageTokenTemp = await getStorageData("@RNAuth:refreshToken");
      setStoregeToken(storageTokenTemp);
    };

    fechStorage();

    getData();
    getDropDownData();
  }, []);

  const getDropDownData = async () => {
    const storageTokenTemp = await getStorageData("@RNAuth:token");

    await RepStockFilterServices.GetAll(storageTokenTemp).then((response) => {
      setItemsProductGroup(
        response.data
          .filter((x) => x.groupId == 1)
          .map((filter) => ({
            label: filter.filterName,
            value: filter.filterName,
            groupName: filter.groupName,
          }))
      );

      setItemsProductSubgroup(
        response.data
          .filter((x) => x.groupId == 2)
          .map((filter) => ({
            label: filter.filterName,
            groupName: filter.groupName,
            value: filter.filterName,
          }))
      );

      setItemsProductSize(
        response.data
          .filter((x) => x.groupId == 3)
          .map((filter) => ({
            label: filter.filterName,
            groupName: filter.groupName,
            value: filter.filterName,
          }))
      );

      setItemsProductType(
        response.data
          .filter((x) => x.groupId == 4)
          .map((filter) => ({
            label: filter.filterName,
            groupName: filter.groupName,
            value: filter.filterName,
          }))
      );

      setItemsProductSeason(
        response.data
          .filter((x) => x.groupId == 5)
          .map((filter) => ({
            label: filter.filterName,
            groupName: filter.groupName,
            value: filter.filterName,
          }))
      );

      setItemsProductColor(
        response.data
          .filter((x) => x.groupId == 6)
          .map((filter) => ({
            label: filter.filterName,
            groupName: filter.groupName,
            value: filter.filterName,
          }))
      );

      setItemsProductColorTheme(
        response.data
          .filter((x) => x.groupId == 7)
          .map((filter) => ({
            label: filter.filterName,
            groupName: filter.groupName,
            value: filter.filterName,
          }))
      );
      setItemsProductThema(
        response.data
          .filter((x) => x.groupId == 8)
          .map((filter) => ({
            label: filter.filterName,
            groupName: filter.groupName,
            value: filter.filterName,
          }))
      );
    });
  };

  const openModal = async () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const closeAboutModal = () => {
    setIsModalProductAboutVisible(false);
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={openModal}>
          <AntDesign
            name="filter"
            size={24}
            color="black"
            style={styles.backIcon}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  const submitModal = () => {
    setDataSource([]);
    setLoading(false);
    setIsListEnd(false);
    setPageNumber(0);

    setIsModalVisible(false);
  };
  const getData = async () => {
    const storageTokenTemp = await getStorageData("@RNAuth:token");

    if (!loading && !isListEnd) {
      setLoading(true);

      let productCodeArr = productCode.length > 0 ? [productCode] : [];
    

      const filterModel = {
        productGroup,
        productSubgroup,
        productSize,
        productType,
        productSeason,
        productColor,
        productColorTheme,
        productThema,
        productCode: productCodeArr,
      };

      const filterModelJson = JSON.stringify(filterModel);

      await RepStocServices.getProductInformationBycode(
        filterModelJson,
        pageSize,
        pageNumber,
        storageTokenTemp
      )
        .then((responseJson) => {
          if (responseJson.data.length > 0) {
            setPageNumber(pageNumber + 1);
            setDataSource([...dataSource, ...responseJson.data]);
            setLoading(false);
          } else {
            setIsListEnd(true);
            setLoading(false);
          }
        });
    }
  };

  const renderFooter = () => {
    return (
      <View style={styles.footer}>
        {loading ? (
          <ActivityIndicator color="black" style={{ margin: 15 }} />
        ) : null}
      </View>
    );
  };
  const handleItemClick = async (item) => {
    setIsModalProductAboutVisible(true);
    setProductAboutDataSource([]);

    const storageTokenTemp = await getStorageData("@RNAuth:token");
    RepStockDetailServices.getProductInfo(
      item.productBarcode,
      storageTokenTemp
    ).then((res) => {
      setProductAboutDataSource(res.data);
    });
  };
  const ItemView = ({ item, index }) => {
    return (
      <Animated.View
        style={{
          padding: 10,
          marginBottom: 10,
          backgroundColor: "rgba(255,255,255,1)",
          borderRadius: 12,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0.58,
          shadowRadius: 16.0,
          elevation: 24,
        }}
      >
        <TouchableOpacity
          onPress={() => handleItemClick(item)}
          activeOpacity={1}
        >
          <View style={styles.horizontalStack}>
            <Text style={{ fontWeight: "bold", fontSize: 15 }}>{item.c1}</Text>
            <Text style={{ fontWeight: "bold", fontSize: 15 }}>{item.c2}</Text>
          </View>
          <View style={styles.horizontalStack}>
            <Text style={{ fontWeight: "bold", fontSize: 15 }}>{item.c3}</Text>
            <Text style={{ color: "#878787" }}>{item.c4}</Text>
          </View>
          <View style={styles.horizontalStack}>
            <Text style={{ color: "#878787" }}>{item.c5}</Text>
            <Text style={{ color: "#878787" }}>{item.c6}</Text>
          </View>
          <View style={styles.horizontalStack}>
            <Text style={{ color: "#878787" }}>{item.c7}</Text>
            <Text style={{ color: "#878787" }}>{item.c8}</Text>
          </View>
          <View style={styles.horizontalStack}>
            <Text style={{ color: "#878787" }}>{item.c9}</Text>
            <Text style={{ color: "#878787" }}>{item.c10}</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const ItemProductAboutView = ({ item }) => {
    return (
      <View style={styles.container}>
        <Text style={{ fontWeight: "bold", marginLeft: 15, fontSize: 15 }}>
          {item.c1}
        </Text>
        <View style={[styles.horizontalStack, { marginTop: 15 }]}>
          <Text>{item.c2}</Text>
          <Text>{item.sC4}</Text>
        </View>
        <View style={styles.horizontalStack}>
          <Text>{item.sC3}</Text>
          <Text>{item.sC5}</Text>
        </View>
      </View>
    );
  };

  const ItemSeparatorView = () => {
    return (
      <View
        style={{
          height: 0.5,
          width: "100%",
          backgroundColor: "#C8C8C8",
        }}
      />
    );
  };

  const clearFilter = () => {
    setProductGroup([]);
    setProductSubgroup([]);
    setProductSize([]);
    setProductType([]);
    setProductSeason([]);
    setProductColor([]);
    setProductColorTheme([]);
    setProductThema([]);
  };

  const getItem = (item) => {
    alert("Id : " + item.id + " Title : " + item.title);
  };

  const pullMe = () => {
    setRefreshing(true);
    setRefreshing(false);
    setLoading(true);
    setIsListEnd(false);
    setPageNumber(0);
    getData();
  };
  const onEnterProductCode = () => {
    setDataSource([]);
    setLoading(false);
    setIsListEnd(false);
    setPageNumber(0);
    setTimeout(() => {
      getData();
    }, 300);
  };
  return (
    <View style={{ flex: 1 }}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.filterContent}>
              <View style={styles.ddpView}>
                <DropDownPicker
                  items={itemsProductGroup}
                  style={styles.DropDownPicker}
                  open={isOpenProductGroup}
                  setOpen={() => setIsOpenProductGroup(!isOpenProductGroup)}
                  value={productGroup}
                  setValue={(val) => setProductGroup(val)}
                  maxHeight={200}
                  autoScroll
                  placeholder={itemsProductGroup[0].groupName}
                  multiple={true}
                  mode="BADGE"
                  listMode="MODAL"
                />
              </View>
              <View style={styles.ddpView}>
                <DropDownPicker
                  items={itemsProductSubgroup}
                  style={styles.DropDownPicker}
                  open={isOpenProductSubgroup}
                  setOpen={() =>
                    setIsOpenProductSubgroup(!isOpenProductSubgroup)
                  }
                  value={productSubgroup}
                  setValue={(val) => setProductSubgroup(val)}
                  maxHeight={200}
                  autoScroll
                  placeholder={itemsProductSubgroup[0].groupName}
                  multiple={true}
                  mode="BADGE"
                  listMode="MODAL"
                />
              </View>
            </View>
            <View style={styles.filterContent}>
              <View style={styles.ddpView}>
                <DropDownPicker
                  items={itemsProductSize}
                  style={styles.DropDownPicker}
                  open={isOpenProductSize}
                  setOpen={() => setIsOpenProductSize(!isOpenProductSize)}
                  value={productSize}
                  setValue={(val) => setProductSize(val)}
                  maxHeight={200}
                  autoScroll
                  placeholder={itemsProductSize[0].groupName}
                  multiple={true}
                  mode="BADGE"
                  listMode="MODAL"
                />
              </View>
              <View style={styles.ddpView}>
                <DropDownPicker
                  items={itemsProductType}
                  style={styles.DropDownPicker}
                  open={isOpenProductType}
                  setOpen={() => setIsOpenProductType(!isOpenProductType)}
                  value={productType}
                  setValue={(val) => setProductType(val)}
                  maxHeight={200}
                  autoScroll
                  placeholder={itemsProductType[0].groupName}
                  multiple={true}
                  mode="BADGE"
                  listMode="MODAL"
                />
              </View>
            </View>
            <View style={styles.filterContent}>
              <View style={styles.ddpView}>
                <DropDownPicker
                  items={itemsProductSeason}
                  style={styles.DropDownPicker}
                  open={isOpenProductSeason}
                  setOpen={() => setIsOpenProductSeason(!isOpenProductSeason)}
                  value={productSeason}
                  setValue={(val) => setProductSeason(val)}
                  maxHeight={200}
                  autoScroll
                  placeholder={itemsProductSeason[0].groupName}
                  multiple={true}
                  mode="BADGE"
                  listMode="MODAL"
                />
              </View>
              <View style={styles.ddpView}>
                <DropDownPicker
                  items={itemsProductColor}
                  style={styles.DropDownPicker}
                  open={isOpenProductColor}
                  setOpen={() => setIsOpenProductColor(!isOpenProductColor)}
                  value={productColor}
                  setValue={(val) => setProductColor(val)}
                  maxHeight={200}
                  autoScroll
                  placeholder={itemsProductColor[0].groupName}
                  multiple={true}
                  mode="BADGE"
                  listMode="MODAL"
                />
              </View>
            </View>
            <View style={styles.filterContent}>
              <View style={styles.ddpView}>
                <DropDownPicker
                  items={itemsProductColorTheme}
                  style={styles.DropDownPicker}
                  open={isOpenProductColorTheme}
                  setOpen={() =>
                    setIsOpenProductColorTheme(!isOpenProductColorTheme)
                  }
                  value={productColorTheme}
                  setValue={(val) => setProductColorTheme(val)}
                  maxHeight={200}
                  autoScroll
                  placeholder={itemsProductColorTheme[0].groupName}
                  multiple={true}
                  mode="BADGE"
                  listMode="MODAL"
                />
              </View>
              <View style={styles.ddpView}>
                <DropDownPicker
                  items={itemsProductThema}
                  style={styles.DropDownPicker}
                  open={isOpenProductThema}
                  setOpen={() => setIsOpenProductThema(!isOpenProductThema)}
                  value={productThema}
                  setValue={(val) => setProductThema(val)}
                  maxHeight={200}
                  autoScroll
                  placeholder={itemsProductThema[0].groupName}
                  multiple={true}
                  mode="BADGE"
                  listMode="MODAL"
                />
              </View>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <View style={{ marginRight: 5 }}>
                <Button
                  title="FİLTERİ TƏMİZLƏ"
                  onPress={clearFilter}
                  style={styles.cancelBtb}
                />
              </View>
              <View>
                <Button title="TƏSDİQ ET" onPress={submitModal} />
              </View>
            </View>
          </View>
        </View>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalProductAboutVisible}
        onRequestClose={closeModal}
        style={styles.modalProductAbout}
      >
        <TouchableWithoutFeedback onPress={closeAboutModal}>
          <View style={styles.modalOverlayProductAbout} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContainerProductAbout}>
          <View style={styles.modalContentProductAbout}>
            <View
              style={{
                padding: 5,
                borderColor: "#C8C8C8",
                borderWidth: 0.5,
                height: "100%",
              }}
            >
              {ProductAboutDataSource.length > 0 ? (
                <FlatList
                  contentContainerStyle={{
                    borderColor: "white",
                    borderWidth: 1,
                  }}
                  data={ProductAboutDataSource}
                  keyExtractor={(item, index) => index.toString()}
                  ItemSeparatorComponent={ItemSeparatorView}
                  renderItem={ItemProductAboutView}
                />
              ) : (
                <ActivityIndicator color="black" style={{ margin: 15 }} />
              )}
            </View>
          </View>
        </View>
      </Modal>
      <View style={{ height: 50, width: "100%", marginTop: 1 }}>
        <View
          style={{
            height: 55,
            width: "100%",
            backgroundColor: "#fff",
            justifyContent: "center",
          }}
        >
          <TextInput
            style={styles.input}
            onChangeText={setProductCode}
            value={productCode}
            placeholder="Məhsul kodu"
            onSubmitEditing={onEnterProductCode}
          />
        </View>
      </View>
      <FlatList
        contentContainerStyle={{
          padding: 10,
          paddingTop: StatusBar.currentHeight - 15 || 42,
        }}
        data={dataSource}
        keyExtractor={(item, index) => index.toString()}
        renderItem={ItemView}
        ListFooterComponent={renderFooter}
        onEndReached={getData}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlayProductAbout: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalOverlay: {
    flex: 0.9,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  filterContent: {
    flexDirection: "row",
    maxWidth: "100%",
    justifyContent: "space-between",
  },
  cancelBtb: {
    paddingRight: 50,
  },
  ddpView: {
    padding: 5,
    maxWidth: "50%",
  },
  DropDownPicker: {
    maxWidth: "100%",
    minWidth: "100%",
  },
  input: {
    marginRight: 10,
    marginLeft: 10,
    padding: 10,
    height: 45,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 20,
  },
  container: {
    shadowColor: "black",
    shadowpageNumber: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.26,
    elevation: 4,
    backgroundColor: "#fff",
    padding: 2,
    marginBottom: 6,
  },

  footer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  horizontalStack: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginHorizontal: 10,
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  modalContainerProductAbout: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-start",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  modalContentProductAbout: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "100%",
    paddingHorizontal: 20,
    paddingVertical: 20,
    width: "100%",
  },
  modalContent: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 20,
    width: "100%",
  },
  backIcon: {
    padding: 15,
  },
});

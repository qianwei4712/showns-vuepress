<template>
  <div>
    <div class="position-coordinate">
      <el-input style="margin-top: 15px;width: 300px;color: black" v-model="viewPoint" readonly></el-input>
    </div>
    <div id="container"></div>
  </div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader'

export default {
  name: "coordinatePick",
  data() {
    return {
      map: null, //地图对象
      viewPoint: '',
      point: {
        clickLng: '',//在地图上选中的经度
        clickLat: '',//在地图上选中的纬度
      }
    }
  },
  created() {
    this.initMap()
  },
  methods: {
    clickMap(e) {
      //拿到经纬度
      this.point.clickLng = e.lnglat.getLng();
      this.point.clickLat = e.lnglat.getLat();
      this.viewPoint = this.point.clickLng + ',' + this.point.clickLat
      this.map.clearMap();
      //添加标记点
      this.addPointer();
    },
    //添加标记点
    addPointer() {
      let that = this
      if (that.point.clickLng != null && that.point.clickLng !== '') {
        //在地图上加标记
        this.marker = new AMap.Marker({
          position: [that.point.clickLng, that.point.clickLat],
        });
        this.marker.setMap(this.map);
      }
    },
    //地图初始化
    initMap() {
      AMapLoader.load({
        key: 'e5435f3ecbdd089317a9cf5781d29198', // 申请好的Web端开发者Key，首次调用 load 时必填
        version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ['AMap.PlaceSearch', 'AMap.AutoComplete'] // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      }).then((AMap) => {
        this.map = new AMap.Map('container', {
          //设置地图容器id
          zoom: 11, //初始化地图级别
          // center: [121.558427, 30.039269] //初始化地图中心点位置
        })
        this.map.on('click', this.clickMap);
      }).catch((e) => {
        console.log(e)
      })
    },
  },
}
</script>

<style scoped>
#container {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 600px;
}

.position-coordinate {
  position: absolute;
  right: 30px;
  z-index: 3000;
}
</style>

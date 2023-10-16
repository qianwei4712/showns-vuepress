<template>
    <div class="coordinatePick">
      <div style="margin-bottom: 25px">
        <el-form ref="form" label-width="120px">
          <el-form-item label="当前坐标系：">
            <el-radio-group v-model="currentUCS">
              <el-radio :label="0" :border="true" size="large">谷歌坐标系</el-radio>
              <el-radio :label="1" :border="true" size="large">火星坐标系</el-radio>
              <el-radio :label="2" :border="true" size="large">百度坐标系</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="输入坐标：">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-input v-model="coordinate" placeholder="116.410329,39.903869"
                size="large" @keyup="wholeCoordinate"></el-input>
              </el-col>
              <el-col :span="6">
                <el-input v-model="longitude" placeholder="例如：39.903869" size="large" @keyup="singleCoordinate"></el-input>
              </el-col>
              <el-col :span="6">
                <el-input v-model="latitude" placeholder="例如：116.410329" size="large" @keyup="singleCoordinate"></el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <div style="text-align: center">
            <el-button type="primary" size="medium" @click="transform">立 即 转 化</el-button>
          </div>
        </el-form>
      </div>
      <el-descriptions title="转化结果：" :column="1" :border="true">
        <el-descriptions-item label="WGS84坐标系">{{ result.wgs }}</el-descriptions-item>
        <el-descriptions-item label="GCJ02坐标系">{{ result.gcj }}</el-descriptions-item>
        <el-descriptions-item label="BD09坐标系">{{ result.bd }}</el-descriptions-item>
      </el-descriptions>
      <el-divider></el-divider>
      <el-descriptions title="坐标系解释：" :column="1" :border="true">
        <el-descriptions-item label="WGS84坐标系">地球坐标系，国际通用坐标系</el-descriptions-item>
        <el-descriptions-item label="GCJ02坐标系">火星坐标系，WGS84坐标系加密后的坐标系；高德、QQ地图</el-descriptions-item>
        <el-descriptions-item label="BD09坐标系">百度坐标系，GCJ02坐标系加密后的坐标系</el-descriptions-item>
      </el-descriptions>
    </div>
  </template>
  
  <script>
  export default {
    name: "coordinatePick",
    data() {
      return {
        currentUCS: 0,//当前坐标系
        coordinate: '',//坐标系，经纬度
        longitude: '',//经度
        latitude: '',//纬度
        result: {
          wgs: '',
          gcj: '',
          bd: '',
        },
        x_PI: 3.14159265358979324 * 3000.0 / 180.0,
        PI: 3.1415926535897932384626,
        a: 6378245.0,
        ee: 0.00669342162296594323
      }
    },
    methods: {
      //完整经纬度更改
      wholeCoordinate() {
        const array = this.coordinate.split(",")
        this.longitude = array[0]
        this.latitude = array[1]
      },
      //单独的经纬度编辑
      singleCoordinate() {
        this.coordinate = this.longitude + ',' + this.latitude
      },
      //立即转化
      transform() {
        if (this.currentUCS === 0) {//地球转其他
          const gcj02 = this.wgs84toGcj02(this.longitude, this.latitude)
          this.result.gcj = gcj02[0] + ',' + gcj02[1]
          const bd09 = this.wgs84toBd09(this.longitude, this.latitude)
          this.result.bd = bd09[0] + ',' + bd09[1]
          this.result.wgs = this.coordinate
          return;
        }
        if (this.currentUCS === 1) {//高德转其他
          const bd09 = this.gcj02toBd09(this.longitude, this.latitude)
          this.result.bd = bd09[0] + ',' + bd09[1]
          const wgs84 = this.gcj02toWgs84(this.longitude, this.latitude)
          this.result.wgs = wgs84[0] + ',' + wgs84[1]
          this.result.gcj = this.coordinate
          return;
        }
        if (this.currentUCS === 2) {//百度转其他
          const gcj02 = this.bd09toGcj02(this.longitude, this.latitude)
          this.result.gcj = gcj02[0] + ',' + gcj02[1]
          const wgs84 = this.bd09toWgs84(this.longitude, this.latitude)
          this.result.wgs = wgs84[0] + ',' + wgs84[1]
          this.result.bd = this.coordinate
        }
      },
      // 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
      gcj02toBd09(lng, lat) {
        const z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * this.x_PI);
        const theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * this.x_PI);
        const rlng = z * Math.cos(theta) + 0.0065;
        const rlat = z * Math.sin(theta) + 0.006;
        return [rlng, rlat]
      },
      // GCJ 转 WGS
      gcj02toWgs84(lng, lat) {
        if (this.outOfChina(lng, lat)) {
          return [lng, lat]
        } else {
          let dlat = this.transFormLat(lng - 105.0, lat - 35.0);
          let dlng = this.transFormLng(lng - 105.0, lat - 35.0);
          const radlat = lat / 180.0 * this.PI;
          let magic = Math.sin(radlat);
          magic = 1 - this.ee * magic * magic;
          var sqrtmagic = Math.sqrt(magic);
          dlat = (dlat * 180.0) / ((this.a * (1 - this.ee)) / (magic * sqrtmagic) * this.PI);
          dlng = (dlng * 180.0) / (this.a / sqrtmagic * Math.cos(radlat) * this.PI);
          const mglat = lat * 1 + dlat;
          const mglng = lng * 1 + dlng;
          const rlng = lng * 2 - mglng;
          const rlat = lat * 2 - mglat;
          return [rlng, rlat]
        }
      },
      // 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
      bd09toGcj02(bd_lon, bd_lat) {
        const x_pi = 3.14159265358979324 * 3000.0 / 180.0;
        const x = bd_lon - 0.0065;
        const y = bd_lat - 0.006;
        const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
        const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
        return [z * Math.cos(theta), z * Math.sin(theta)]
      },
      // BD 转 WGS
      bd09toWgs84(bd_lon, bd_lat) {
        //先百度09转高德
        const gcj02 = this.bd09toGcj02(bd_lon, bd_lat);
        //再转成wgs
        return this.gcj02toWgs84(gcj02[0], gcj02[1])
      },
      // WGS 转 BD
      wgs84toBd09(lng, lat) {
        //先转gcj，再转bd
        const gcj02 = this.wgs84toGcj02(lng, lat);
        return this.gcj02toBd09(gcj02[0], gcj02[1])
      },
      // WGS 转 GCJ
      wgs84toGcj02(lng, lat) {
        if (this.outOfChina(lng, lat)) {
          return [lng, lat]
        } else {
          let dlat = this.transFormLat(lng - 105.0, lat - 35.0);
          let dlng = this.transFormLng(lng - 105.0, lat - 35.0);
          const radlat = lat / 180.0 * this.PI;
          let magic = Math.sin(radlat);
          magic = 1 - this.ee * magic * magic;
          const sqrtmagic = Math.sqrt(magic);
          dlat = (dlat * 180.0) / ((this.a * (1 - this.ee)) / (magic * sqrtmagic) * this.PI);
          dlng = (dlng * 180.0) / (this.a / sqrtmagic * Math.cos(radlat) * this.PI);
          const mglat = lat * 1 + dlat;
          const mglng = lng * 1 + dlng;
          return [mglng, mglat]
        }
      },
      //判断是否在国内，不在国内则不做偏移
      outOfChina(lng, lat) {
        return (lng < 72.004 || lng > 137.8347) || ((lat < 0.8293 || lat > 55.8271) || false);
      },
      transFormLat(lng, lat) {
        let ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
        ret += (20.0 * Math.sin(6.0 * lng * this.PI) + 20.0 * Math.sin(2.0 * lng * this.PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(lat * this.PI) + 40.0 * Math.sin(lat / 3.0 * this.PI)) * 2.0 / 3.0;
        ret += (160.0 * Math.sin(lat / 12.0 * this.PI) + 320 * Math.sin(lat * this.PI / 30.0)) * 2.0 / 3.0;
        return ret
      },
      transFormLng(lng, lat) {
        let ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
        ret += (20.0 * Math.sin(6.0 * lng * this.PI) + 20.0 * Math.sin(2.0 * lng * this.PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(lng * this.PI) + 40.0 * Math.sin(lng / 3.0 * this.PI)) * 2.0 / 3.0;
        ret += (150.0 * Math.sin(lng / 12.0 * this.PI) + 300.0 * Math.sin(lng / 30.0 * this.PI)) * 2.0 / 3.0;
        return ret
      }
    }
  }
  </script>
  
  <style scoped>
  
  </style>
  
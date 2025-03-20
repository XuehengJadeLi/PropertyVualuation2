<template>
  <div id="cesiumContainer" class="cesium-container"></div>
</template>

<script>
export default {
  name: 'CesiumViewer',
  data() {
    return {
      viewer: null
    }
  },
  mounted() {
    // We're getting Cesium from a global variable because we're loading it via script tag
    // This ensures we have no import issues
    const Cesium = window.Cesium;
    
    if (!Cesium) {
      // Load Cesium from CDN if not already loaded
      const script = document.createElement('script');
      script.src = 'https://cesium.com/downloads/cesiumjs/releases/1.127.0/Build/Cesium/Cesium.js';
      script.onload = () => this.initCesium(window.Cesium);
      document.head.appendChild(script);
    } else {
      this.initCesium(Cesium);
    }
  },
  methods: {
    initCesium(Cesium) {
      // Set your access token
      Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzZDE5ZTQ0Ni00ZDU0LTQ3MDgtYWQ5MC01N2EyNDg5MTVmZjgiLCJpZCI6Mjc3MzY1LCJpYXQiOjE3Mzk5NzA3MDF9.rHw3crY1W96qSzIdAwLE4lmB3e3YS0c5rvfiigf4xBs';
      
      // Create the viewer
      this.viewer = new Cesium.Viewer('cesiumContainer', {
        animation: false,
        baseLayerPicker: false,
        fullscreenButton: false,
        geocoder: false,
        homeButton: false,
        infoBox: false,
        sceneModePicker: false,
        timeline: false
      });
      
      // Set camera position
      this.viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(4.440982, 51.910920, 300)
      });
      
      // Load 3D tileset
      const tileset = new Cesium.Cesium3DTileset({
        url: Cesium.IonResource.fromAssetId(3224749)
      });
      
      // Add to scene
      this.viewer.scene.primitives.add(tileset);
    }
  },
  beforeUnmount() {
    if (this.viewer) {
      this.viewer.destroy();
    }
  }
}
</script>

<style>
.cesium-container {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
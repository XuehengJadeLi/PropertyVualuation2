<!-- src/components/CesiumViewer.vue -->
<template>
  <div id="cesiumContainer" class="viewer-container"></div>
</template>

<script>
import * as Cesium from 'cesium';

export default {
  name: 'CesiumViewer',
  data() {
    return {
      viewer: null
    }
  },
  mounted() {
    // Set Cesium Ion access token
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzZDE5ZTQ0Ni00ZDU0LTQ3MDgtYWQ5MC01N2EyNDg5MTVmZjgiLCJpZCI6Mjc3MzY1LCJpYXQiOjE3Mzk5NzA3MDF9.rHw3crY1W96qSzIdAwLE4lmB3e3YS0c5rvfiigf4xBs';
    
    // Create the Cesium Viewer
    this.viewer = new Cesium.Viewer('cesiumContainer', {
      animation: true,
      timeline: true,
      fullscreenButton: true,
      // Use the built-in EllipsoidTerrainProvider instead of createWorldTerrain
      terrainProvider: new Cesium.EllipsoidTerrainProvider()
    });
    
    // Set initial camera position to Rotterdam
    this.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(4.440982, 51.910920, 100),
      orientation: {
        heading: Cesium.Math.toRadians(-13),
        pitch: Cesium.Math.toRadians(-45),
        roll: 0
      }
    });
    
    // Load the local 3D Tileset
    // Path is relative to the public folder
    try {
      console.log("Attempting to load tileset from: Rotterdam/10-304-516/tileset.json");
      
      const tileset = new Cesium.Cesium3DTileset({
        url: 'Rotterdam/10-304-516/tileset.json'
      });
      
      // Add the tileset to the scene
      this.viewer.scene.primitives.add(tileset);
      
      // Set viewer to use the native coordinates of the tileset
      // This is important for using the proper coordinate reference system
      this.viewer.scene.globe.depthTestAgainstTerrain = true;
      
      // Zoom to tileset once loaded
      tileset.readyPromise
        .then(() => {
          console.log("Tileset loaded successfully!");
          this.viewer.zoomTo(tileset);
        })
        .catch(error => {
          console.error("Error loading tileset:", error);
        });
    } catch (error) {
      console.error("Error setting up tileset:", error);
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
.viewer-container {
  width: 100%;
  height: 100vh;
  position: relative;
}
</style>
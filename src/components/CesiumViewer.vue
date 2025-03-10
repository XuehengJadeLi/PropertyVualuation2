# src/components/CesiumViewer.vue
<template>
  <div class="viewer-container">
    <!-- Add upload form -->
    <div class="upload-panel">
      <h3>Upload GLTF Model</h3>
      <input 
        type="file" 
        @change="handleFileUpload" 
        accept=".gltf,.bin" 
        multiple
        class="file-input"
      >
      <button @click="uploadFiles" class="upload-button">Upload</button>
      
      <!-- Model list -->
      <div class="model-list">
        <h4>Uploaded Models</h4>
        <ul>
          <li v-for="model in uploadedModels" :key="model.id">
            {{ model.name }}
          </li>
        </ul>
      </div>
    </div>

    <vc-viewer
      ref="viewer"
      :animation="true"
      :timeline="true"
      :fullscreenButton="true"
      :scene3DOnly="true"
      @ready="onViewerReady"
    >
      <vc-layer-imagery>
        <vc-imagery-provider-osm />
      </vc-layer-imagery>
      
      <vc-camera
        :position="cameraPosition"
        :heading="cameraHeading"
        :pitch="cameraPitch"
        :roll="cameraRoll"
      />
    </vc-viewer>
  </div>
</template>

<script>
import * as Cesium from 'cesium'
import axios from 'axios'

export default {
  name: 'CesiumViewer',
  data() {
    return {
      viewer: null,
      selectedFiles: null,
      uploadedModels: [],
      serverUrl: 'http://localhost:3000',
      cameraPosition: {
        longitude: 4.440982,
        latitude: 51.910920,
        height: 100
      },
      cameraHeading: -13,
      cameraPitch: -45,
      cameraRoll: 0
    }
  },
  methods: {
    handleFileUpload(event) {
      this.selectedFiles = event.target.files
    },

    async uploadFiles() {
      if (!this.selectedFiles) {
        alert('Please select files first')
        return
      }

      const formData = new FormData()
      for (let i = 0; i < this.selectedFiles.length; i++) {
        formData.append('models', this.selectedFiles[i])
      }

      try {
        await axios.post(`${this.serverUrl}/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        this.fetchModels()
        alert('Upload successful!')
      } catch (error) {
        console.error('Upload error:', error)
        alert('Error uploading files')
      }
    },

    async fetchModels() {
      try {
        const response = await axios.get(`${this.serverUrl}/api/models`)
        this.uploadedModels = response.data.models
        this.loadModels()
      } catch (error) {
        console.error('Error fetching models:', error)
      }
    },

    loadModels() {
      if (!this.viewer) return

      // Clear existing entities
      this.viewer.entities.removeAll()

      // Load each model
      this.uploadedModels.forEach(model => {
        this.viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(
            this.cameraPosition.longitude,
            this.cameraPosition.latitude,
            0
          ),
          model: {
            uri: `${this.serverUrl}${model.url}`,
            scale: 1,
            minimumPixelSize: 128,
            maximumScale: 20000
          }
        })
      })
    },

    onViewerReady({ viewer }) {
      this.viewer = viewer
      this.flyToLocation(
        this.cameraPosition.longitude,
        this.cameraPosition.latitude,
        this.cameraPosition.height
      )
      this.fetchModels()
    },

    flyToLocation(longitude, latitude, height) {
      if (this.viewer) {
        this.viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, height),
          orientation: {
            heading: Cesium.Math.toRadians(this.cameraHeading),
            pitch: Cesium.Math.toRadians(this.cameraPitch),
            roll: Cesium.Math.toRadians(this.cameraRoll)
          },
          duration: 2
        })
      }
    }
  }
}
</script>

<style scoped>
.viewer-container {
  width: 100%;
  height: 100vh;
  position: relative;
}

.upload-panel {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1000;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.file-input {
  margin: 10px 0;
  width: 100%;
}

.upload-button {
  background: #4CAF50;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.upload-button:hover {
  background: #45a049;
}

.model-list {
  margin-top: 20px;
}

.model-list ul {
  list-style: none;
  padding: 0;
}

.model-list li {
  padding: 5px 0;
  border-bottom: 1px solid #eee;
}
</style>
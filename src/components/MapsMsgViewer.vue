<template>
    <div>
        <div class="map-container">
            <div class="location-container" v-if="locationInfo">
                <div class="location-map">
                    <a :href="googleMapsUrl" target="_blank">
                        <img :src="mapUrl" alt="Localização">
                    </a>
                </div>
                <div class="location-name">
                    <a :href="googleMapsUrl" target="_blank">{{ locationInfo.location.name }}</a>
                </div>
                <div class="location-address">{{ locationInfo.location.address }}</div>
            </div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { ref, onMounted, defineProps } from 'vue';
import { Loader } from '@googlemaps/js-api-loader';

const loader = new Loader({
    apiKey: 'AIzaSyBmn-rkxCUD6zUWBVg2E3iDU4L3KgN-upo',
    version: 'weekly',
    libraries: ['places']
});

const props = defineProps({
    location: String,
});

interface locationInterface {
    location: {
        latitude: number;
        longitude: number;
        address: string;
        name: string;
    }
}

const locationInfo = ref<locationInterface>();
const mapUrl = ref<string>('');
const googleMapsUrl = ref<string>('');

const loadMap = () => {
    if (props.location) {
        locationInfo.value = JSON.parse(props.location);
        if (locationInfo.value) {
            const center = `${locationInfo.value.location.latitude},${locationInfo.value.location.longitude}`;
            const zoom = 15;
            const size = '600x300';
            const maptype = 'roadmap';
            const format = 'png';
            const markers = `color:red|label:A|${center}`;

            const url = `https://maps.googleapis.com/maps/api/staticmap?center=${center}&zoom=${zoom}&size=${size}&maptype=${maptype}&format=${format}&markers=${markers}&key=${loader.apiKey}`;
            mapUrl.value = url;

            // Adicionar a URL do Google Maps com a localização
            const addressEncoded = encodeURIComponent(locationInfo.value.location.address);
            googleMapsUrl.value = `https://www.google.com/maps/search/?api=1&query=${addressEncoded}`;
        }
    }
};

onMounted(() => {
    loadMap();
});
</script>
  
  
<style scoped>
.leaflet-container {
    height: 100%;
    width: 100%;
}

.leaflet-popup-content {
    text-align: center;
    font-weight: bold;
}

.location-container {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 10px;
    border-radius: 15px;
    margin-top: 10px;
}

.location-name {
    font-weight: bold;
    font-size: 16px;
}

.location-address {
    font-size: 14px;
    margin-bottom: 10px;
}

.location-map {
    height: 12rem;
    width: 100%;
    overflow: hidden;
    border-radius: 15px;
}

.location-map img {
    max-height: 100%;
    max-width: 100%;
    border-radius: 15px;
}
</style>
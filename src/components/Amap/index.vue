<template>
  <div class="position-relative">
    <input
      type="text"
      class="form-control pe-5 text-truncate"
      :class="fieldClass"
      :placeholder="placeholder"
      :disabled="disabled"
      v-model="vModel"
    />
    <button
      v-if="$store.state.sys.cfg.amapJsApi"
      type="button"
      class="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
      :disabled="disabled"
      @click="handleShowAmap"
      data-bs-toggle="offcanvas"
      :data-bs-target="`#amapOffcanvas_${id}`"
    >
      <i class="align-middle mdi mdi-map-search-outline"></i>
    </button>
    <div class="offcanvas offcanvas-top" :id="`amapOffcanvas_${id}`" style="height: 100vh">
      <i
        :id="`hideAmapOffcanvas_${id}Btn`"
        class="i-close d-block mdi mdi-close-box fs-24 text-muted cursor-pointer"
        data-bs-dismiss="offcanvas"
      />
      <div class="position-absolute p-2 search" style="z-index: 1">
        <input
          type="text"
          class="form-control mb-2"
          :placeholder="$t('components.amap.search')"
          v-model="search_str"
          style="z-index: 1"
          @click="handleClickSearcher"
          @input="handleSearchTips"
        />

        <div class="list-group" data-simplebar style="max-height: 40vh; z-index: 1">
          <div
            class="list-group-item list-group-item-action cursor-pointer text-truncate"
            v-for="(tip, index) in tips"
            :key="index"
            :title="`${tip.name} - ${tip.district}`"
            @click="handleClickTip(tip)"
          >
            {{ tip.name }} - {{ tip.district }}
          </div>
          <div
            class="list-group-item list-group-item-action cursor-pointer p-2"
            :class="{ active: poi.id === position.id }"
            v-for="(poi, index) in pois"
            :key="index"
            @click="handleClickPoi(poi)"
          >
            <div class="d-flex align-items-center">
              <div class="flex-shrink-0">
                <img
                  :src="poi.photos ? poi.photos[0].url : require('@/assets/images/amap/amap.png')"
                  :alt="poi.photos ? poi.photos[0].title : ''"
                  class="avatar-sm rounded"
                  @click.stop.prevent="
                    () => {
                      if (poi.photos)
                        $viewerApi({
                          options: {
                            focus: false,
                            movable: false,
                          },
                          images: poi.photos.map((photo) => {
                            return photo.url;
                          }),
                        });
                    }
                  "
                  loading="lazy"
                />
              </div>
              <div class="flex-grow-1 ms-2" style="width: 85%">
                <h5 class="list-title fs-15 mb-1 text-truncate" :title="poi.name">
                  {{ index + 1 }}. {{ poi.name }}
                </h5>
                <p class="list-text mb-0 fs-12 text-truncate" :title="poi.address">
                  {{ poi.address }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="position-absolute text-end text-dark p-3"
        style="z-index: 1; right: 0; bottom: 0"
        v-if="position"
      >
        <div class="cursor-pointer" @click="handleSelectPosition('address')">
          {{ position.address }}
        </div>
        <div class="cursor-pointer" @click="handleSelectPosition('location')">
          {{ position.location.lng }},{{ position.location.lat }}
        </div>
      </div>
      <div :id="`amap_${id}`" class="w-100 h-100"></div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import AMapLoader from '@amap/amap-jsapi-loader';
import { useToast } from 'vue-toastification';
import ToastificationContent from '@components/ToastificationContent';
import { isLngLat, copyToClipboard, debounce } from '@utils';
import i18n from '@utils/i18n';
import store from '@store';

// eslint-disable-next-line
const props = defineProps({
  id: {
    type: String,
    default: () => '',
    requried: true,
  },
  modelValue: {
    type: String,
    default: () => '',
    requried: true,
  },
  placeholder: {
    type: String,
    default: () => '',
    requried: true,
  },
  disabled: {
    type: Boolean,
    default: () => false,
    requried: true,
  },
  fieldClass: {
    type: [String, Object],
    default: '',
    requried: true,
  },
});

// eslint-disable-next-line
const emits = defineEmits(['update:modelValue']);

const toast = useToast();
let AMap = null;
let amap = null;

onMounted(async () => {
  if (store.state.sys.cfg.amapJsApi) {
    AMap = await AMapLoader.load({
      key: store.state.sys.cfg.amapJsApi,
      version: '2.0',
      plugins: ['AMap.AutoComplete', 'AMap.PlaceSearch', 'AMap.Geocoder', 'AMap.CitySearch'],
    });

    amap = new AMap.Map(`amap_${props.id}`, {
      zoom: 15,
      showIndoorMap: true,
      // showIndoorMap: false,
      // layers: [indoorMap, AMap.createDefaultLayer()],
    });

    amap.setMapStyle(`amap://styles/${store.state.sys.theme === 'dark' ? 'dark' : 'normal'}`);
    amap.on('click', onClickMap);
  }
});

let autoComplete = null;
let placeSearch = null;
let geoCoder = null;
let citysearch = null;
let marker = null;

const vModel = computed({
  get() {
    return props.modelValue || '';
  },
  set(value) {
    emits('update:modelValue', value);
  },
});

const handleSelectPosition = (key) => {
  document.getElementById(`hideAmapOffcanvas_${props.id}Btn`).click();
  copyToClipboard(
    `${position.value.address}@${position.value.location.lng},${position.value.location.lat}`,
  );
  if (key === 'location')
    vModel.value = `${position.value.location.lng},${position.value.location.lat}`;
  else vModel.value = position.value.address;
};

const position = ref(null);
const search_str = ref(null);
const tips = ref([]);
const pois = ref([]);

const handleShowAmap = () => {
  tips.value = [];
  pois.value = [];

  if (!store.state.sys.cfg.amapJsApi) {
    toast({
      component: ToastificationContent,
      props: {
        variant: 'danger',
        icon: 'mdi-alert',
        text: 'components.amap.missingKey',
      },
    });
    return;
  }

  if (!AMap) {
    toast({
      component: ToastificationContent,
      props: {
        variant: 'danger',
        icon: 'mdi-alert',
        text: 'components.amap.initialization.failed',
      },
    });
    return;
  }

  autoComplete = autoComplete || new AMap.AutoComplete();
  placeSearch = placeSearch || new AMap.PlaceSearch({ extensions: 'all' });
  geoCoder = geoCoder || new AMap.Geocoder();
  citysearch = citysearch || new AMap.CitySearch();

  marker = marker || new AMap.Marker();
  marker.setMap(amap);

  if (vModel.value) {
    if (isLngLat(vModel.value)) {
      onReGeoCoding({
        lng: vModel.value.split(',')[0],
        lat: vModel.value.split(',')[1],
      });
    } else {
      placeSearch.search(vModel.value, (status, result) => {
        if (status === 'complete' && result.poiList && result.poiList.count != 0) {
          position.value = {
            location: result.poiList.pois[0].location,
            address: vModel.value,
          };
          marker.setPosition([
            result.poiList.pois[0].location.lng,
            result.poiList.pois[0].location.lat,
          ]);
          amap.setZoomAndCenter(15, [
            result.poiList.pois[0].location.lng,
            result.poiList.pois[0].location.lat,
          ]);
          marker.setTitle(vModel.value);
          search_str.value = vModel.value;
        }
      });
    }
  } else {
    searchCity((bounds) => {
      amap.setBounds(bounds);
    });
  }
};

const onClickMap = (e) => {
  tips.value = [];
  pois.value = [];
  onReGeoCoding(e.lnglat, false);
};

const searchCity = (callback) => {
  citysearch.getLocalCity((status, result) => {
    if (status === 'complete' && result.info === 'OK') {
      if (result && result.bounds) {
        callback && callback(result.bounds);
      }
    }
  });
};

const onReGeoCoding = (lnglat, setZoomAndCenter = true) => {
  geoCoder.getAddress(lnglat, (status, result) => {
    if (status === 'complete' && result.regeocode) {
      position.value = {
        location: lnglat,
        address: result.regeocode.formattedAddress,
      };
      marker.setPosition([lnglat.lng, lnglat.lat]);
      if (setZoomAndCenter) amap.setZoomAndCenter(15, [lnglat.lng, lnglat.lat]);
      marker.setTitle(result.regeocode.formattedAddress);
      search_str.value = result.regeocode.formattedAddress;
    }
  });
};

const handleClickSearcher = () => {
  if (search_str.value) handleSearchTips();
};

const handleSearchTips = debounce((e) => {
  tips.value = [];
  pois.value = [];
  autoComplete.search(e?.target?.value || search_str.value, (status, result) => {
    if (status == 'complete' && result.tips) {
      tips.value = result.tips;
    }
  });
}, 500);

const handleClickTip = (option) => {
  tips.value = [];
  pois.value = [];
  placeSearch.search(option.name, (status, result) => {
    if (status === 'complete' && result?.poiList?.count != 0) {
      pois.value = result.poiList.pois;
      handleClickPoi(pois.value[0]);
    } else {
      toast({
        component: ToastificationContent,
        props: {
          variant: 'danger',
          icon: 'mdi-alert',
          text: i18n.globak.t('components.amap.tips.empty', {
            district: option.district,
            name: option.name,
          }),
        },
      });
    }
  });
};

const handleClickPoi = (poi) => {
  position.value = poi;
  marker.setPosition([poi.location.lng, poi.location.lat]);
  amap.setZoomAndCenter(15, [poi.location.lng, poi.location.lat]);
  marker.setTitle(poi.address);
};
</script>

<style lang="scss" scoped>
.search {
  opacity: 0.8;
  width: 390px;

  @media (max-width: 800px) {
    width: 90% !important;
  }
}
</style>

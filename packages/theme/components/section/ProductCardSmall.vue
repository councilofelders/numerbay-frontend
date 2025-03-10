<template>
  <div class="card card-full">
    <div class="card-image">
      <img :src="productGetters.getCoverImage(product)" alt="art image" class="card-img-top max-height-200">
    </div>
    <div class="card-body p-4">
      <h5 class="card-title text-truncate mb-0">{{ productGetters.getName(product).toUpperCase() }}</h5>
      <div class="card-author mb-1 d-flex align-items-center">
        <span class="me-1 card-author-by">{{ productGetters.getCategory(product).slug }}</span>
      </div><!-- end card-author -->
      <div class="card-price-wrap d-flex align-items-center justify-content-between mb-3">
        <div class="me-2">
          <span class="card-price-title">{{productGetters.getOptionFormattedDescription(productGetters.getOrderedOption(product, product.optionIdx), productGetters.getCategory(product))}}</span>
          <span class="card-price-number">{{
              productGetters.getOptionFormattedPrice(productGetters.getOrderedOption(product, product.optionIdx))
            }}</span>
        </div>
        <div>
          <div class="custom-tooltip-wrap">
            <a v-show="!!productGetters.getCategory(product).is_per_model" class="custom-tooltip author-link link-secondary fs-13"
               href="javascript:void(0);">Metrics...</a>
            <div class="card-generic custom-tooltip-dropdown">
              <div class="metrics-wrap mb-3">
                <h6 class="mb-1 smaller text-uppercase">Model Metrics</h6>
              </div><!-- end metrics-wrap  -->
              <ModelMetricsCard
                :latest-ranks="latestRanks"
                :latest-reps="latestReps"
                :latest-returns="latestReturns"
                :nmr-staked="nmrStaked"
                :stake-info="stakeInfo"
                :tournament="productGetters.getCategory(product).tournament"
              ></ModelMetricsCard>
            </div><!-- end dropdown-menu -->
          </div>
        </div>
      </div><!-- end card-price-wrap -->
      <span :class="productGetters.getIsActive(product)?'btn-dark':'btn-light disabled'" class="btn btn-sm">Buy</span>
    </div><!-- end card-body -->
    <router-link
      :to="{
                name: 'ProductDetailsByFullName',
                params: {
                id: product.id,
                category: productGetters.getCategory(product).slug,
                name: productGetters.getName(product),
                slug: productGetters.getSlug(product),
                owner: productGetters.getOwner(product),
                description: productGetters.getDescription(product),
                modelUrl: productGetters.getModelUrl(product),
                nmrStaked: productGetters.getModelNmrStaked(product, 2),
                stakeInfoCorrMultiplier: productGetters.getModelStakeInfo(product, 'corrMultiplier'),
                stakeInfoMmcMultiplier: productGetters.getModelStakeInfo(product, 'mmcMultiplier'),
                stakeInfoTcMultiplier: productGetters.getModelStakeInfo(product, 'tcMultiplier'),
                latestRankCorr: productGetters.getModelRank(product, 'corr'),
                latestRankMmc: productGetters.getModelRank(product, 'mmc'),
                latestRankFnc: productGetters.getModelRank(product, 'fnc'),
                latestRankTc: productGetters.getModelRank(product, 'tc'),
                latestRankIc: productGetters.getModelRank(product, 'ic'),
                latestRepCorr: productGetters.getModelRep(product, 'corr'),
                latestRepMmc: productGetters.getModelRep(product, 'mmc'),
                latestRepFnc: productGetters.getModelRep(product, 'fnc'),
                latestRepFncV3: productGetters.getModelRep(product, 'fncV3'),
                latestRepTc: productGetters.getModelRep(product, 'tc'),
                latestRepIc: productGetters.getModelRep(product, 'ic'),

                title: productGetters.getName(product).toUpperCase(),
                price: productGetters.getOptionFormattedPrice(productGetters.getOrderedOption(product, product.optionIdx)),
                priceTwo: productGetters.getOptionFormattedPrice(productGetters.getOrderedOption(product, product.optionIdx)),
                imgLg: productGetters.getCoverImage(product)
                }
            }"
      class="details"
    >
    </router-link>
  </div><!-- end card -->
</template>
<script>
import ModelMetricsCard from "./ModelMetricsCard";
import {createPopper} from '@popperjs/core';

// Composables
import {productGetters} from '@numerbay/numerbay';

export default {
  name: 'ProductCard',
  components: {
    ModelMetricsCard
  },
  props: {
    product: {
      type: Object,
      default: () => {
      }
    }
  },
  computed: {
    nmrStaked() {
      return this.productGetters.getModelNmrStaked(this.product, 2);
    },
    stakeInfo() {
      return {
        corrMultiplier: this.productGetters.getModelStakeInfo(this.product, 'corrMultiplier') || (this.productGetters.getCategory(this.product).tournament === 8 ? 0 : 2),
        mmcMultiplier: this.productGetters.getModelStakeInfo(this.product, 'mmcMultiplier') || 0,
        tcMultiplier: this.productGetters.getModelStakeInfo(this.product, 'tcMultiplier') || 0
      };
    },
    latestRanks() {
      return this.product?.model?.latest_ranks;
    },
    latestReps() {
      return this.product?.model?.latest_reps;
    },
    latestReturns() {
      return {
        oneDay: this.productGetters.getModelReturn(this.product, 'oneDay'),
        threeMonths: this.productGetters.getModelReturn(this.product, 'threeMonths'),
        oneYear: this.productGetters.getModelReturn(this.product, 'oneYear'),
        allTime: this.productGetters.getModelReturn(this.product, 'allTime')
      };
    }
  },
  methods: {
    isModelFileProduct(product) {
      return Boolean(productGetters.getCategory(product)) && productGetters.getCategory(product).slug.includes('-models');
    },
    isDataFileProduct(product) {
      return Boolean(productGetters.getCategory(product)) && productGetters.getCategory(product).slug.includes('-data');
    }
  },
  mounted() {

    /* ============= Custom Tooltips =============== */
    function customTooltip(selector, active) {
      const elem = document.querySelectorAll(selector);
      if (elem.length > 0) {
        elem.forEach(item => {
          const parent = item.parentElement;
          const next = item.nextElementSibling;
          createPopper(item, next);
          parent.addEventListener('mouseenter', function () {
            parent.classList.add(active);
          });
          parent.addEventListener('mouseleave', function () {
            parent.classList.remove(active);
          });
        });
      }
    }

    customTooltip('.custom-tooltip', 'active');

  },
  setup() {
    return {
      productGetters
    };
  }
};
</script>

<style lang="css" scoped>
.details {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.author-link {
  z-index: 2;
  position: relative;
}

.max-height-200 {
  height: 100%;
  max-height: 200px;
  object-fit: cover;
}
</style>

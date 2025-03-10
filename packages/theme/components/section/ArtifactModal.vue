<template>
  <Modal :modal-id="modalId" modal-class="modal-lg" @registeredModal="modal = $event">
    <template slot="title">Artifact Files</template>
    <div class="row g-2">
      <div class="col-xl-12">
        <table v-if="artifacts && orderGetters.getStatus(order)=='confirmed' && !order.buyer_public_key"
               class="table mb-0 table-s2">
          <thead class="fs-14">
          <tr>
            <th v-for="(list, i) in [
                      'Time',
                      'Download File',
                      'Numerai Submission'
                    ]" :key="i" scope="col">{{ list }}
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="!artifacts || artifacts.total===0">
            <td class="text-secondary" colspan="2">Please wait for the seller to upload artifacts after the round
              opens
              <button :disabled="orderLoading" class="btn btn-outline-dark mt-3 d-flex justify-content-center"
                      type="button" @click="handleSendUploadReminder">
                <span v-if="orderLoading"><span class="spinner-border spinner-border-sm me-2" role="status"></span>Sending...</span>
                <span v-else>Send reminder</span>
              </button>
              <!--              <span v-if="order.last_reminder_date">Last reminder sent: {{new Date(Date.parse(order.last_reminder_date)).toLocaleString()}}</span>-->
            </td>
          </tr>
          <tr v-for="artifact in artifacts.data" :key="artifactGetters.getId(artifact)">
            <td>
              <span class="text-break" style="white-space: normal;">{{ formatDate(artifact.date) }}</span>
            </td>
            <td>
              <span class="text-break" style="white-space: normal;">
                <a :title="`Download ${artifactGetters.getObjectName(artifact)}`" href="javascript:void(0);"
                   @click="download(artifact)">{{
                    artifactGetters.getObjectName(artifact)
                  }}</a>
                <span v-if="isActiveArtifact(artifact)" class="spinner-border spinner-border-sm text-primary"
                      role="status"></span>
              </span>
            </td>
            <td>
              <div v-if="Boolean(artifact) && !!artifact.object_name && !!order.submit_model_id"
                   class="d-flex justify-content-between">
                <button class="icon-btn ms-auto" title="Submit to Numerai" @click="submit(artifact)">
                  <span v-if="loading" class="spinner-border spinner-border-sm" role="status"></span>
                  <em v-else class="ni ni-upload-cloud"></em>
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
        <table v-if="orderArtifacts && orderGetters.getStatus(order)=='confirmed' && Boolean(order.buyer_public_key)"
               class="table mb-0 table-s2">
          <thead class="fs-14">
          <tr>
            <th v-for="(list, i) in [
                      'Time',
                      'Download File',
                      'Numerai Submission'
                    ]" :key="i" scope="col">{{ list }}
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="!orderArtifacts || orderArtifacts.total===0">
            <td class="text-secondary" colspan="2">Please wait for the seller to upload artifacts after the round
              opens
              <button :disabled="orderLoading" class="btn btn-outline-dark mt-3 d-flex justify-content-center"
                      type="button" @click="handleSendUploadReminder">
                <span v-if="orderLoading"><span class="spinner-border spinner-border-sm me-2" role="status"></span>Sending...</span>
                <span v-else>Send reminder</span>
              </button>
              <!--              <span v-if="order.last_reminder_date">Last reminder sent: {{new Date(Date.parse(order.last_reminder_date)).toLocaleString()}}</span>-->
            </td>
          </tr>
          <tr v-for="artifact in orderArtifacts.data" :key="artifactGetters.getId(artifact)">
            <td>
              <span class="text-break" style="white-space: normal;">{{ formatDate(artifact.date) }}</span>
            </td>
            <td>
              <span class="text-break" style="white-space: normal;">
                <a :title="`Download ${artifactGetters.getObjectName(artifact)}`" href="javascript:void(0);"
                   @click="downloadAndDecrypt(artifact)">{{
                    artifactGetters.getObjectName(artifact)
                  }}</a>
                <span v-if="isActiveArtifact(artifact)" class="spinner-border spinner-border-sm text-primary"
                      role="status"></span>
              </span>
            </td>
            <td>
            </td>
          </tr>
          </tbody>
        </table>
        <div class="alert alert-info d-flex mb-4" role="alert" v-if="!orderArtifacts || orderArtifacts.total===0">
          <svg class="flex-shrink-0 me-3" fill="currentColor" height="30" viewBox="0 0 24 24" width="30">
            <path
              d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20, 12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10, 10 0 0,0 12,2M11,17H13V11H11V17Z"></path>
          </svg>
          <p class="fs-14">
            File is uploaded per-order for this product. <a href="javascript:" title="This product uses end-to-end encryption for each order. Even if the product is ready, you will still need to wait for upload for your order after checkout.">What does this mean <em class="ni ni-help"></em></a>
          </p>
        </div><!-- end alert -->
      </div>
    </div>
  </Modal><!-- end modal-->
</template>
<script>
// Composables
import {
  artifactGetters,
  orderGetters,
  useOrderArtifact,
  useProductArtifact,
  useUserOrder
} from '@numerbay/numerbay';
import {computed, ref} from '@vue/composition-api';
import axios from 'axios';
import {decodeBase64} from 'tweetnacl-util';
import nacl from 'tweetnacl';
import {useUiNotification} from '~/composables';

nacl.sealedbox = require('tweetnacl-sealedbox-js');

// decryption
function readfile(file) {
  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => {
      resolve(fr.result);
    };
    fr.readAsArrayBuffer(file);
  });
}

export default {
  name: 'ArtifactModal',
  props: {
    modalId: {
      type: String,
      default: 'artifactModal'
    },
    order: {
      type: Object,
      default: () => ({})
    },
    publicKey: {
      type: String,
      default: null
    },
    encryptedPrivateKey: {
      type: String,
      default: null
    },
    publicKeyV2: {
      type: String,
      default: null
    },
    encryptedPrivateKeyV2: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      modal: null,
      downloadingProgress: {}
    };
  },
  methods: {
    show() {
      this.search({productId: this.order.product.id});
      this.searchOrderArtifacts({orderId: this.order.id});
      this.modal?.show();
    },
    hide() {
      this.modal?.hide();
    },
    formatDate(value) {
      return new Date(Date.parse(value)).toLocaleString()
    },
    getMetricColor(value) {
      if (value > 0) {
        return 'success';
      } else if (value < 0) {
        return 'danger';
      } else {
        return '';
      }
    },
    isActiveArtifact(artifact) {
      return this.activeArtifacts && this.activeArtifacts.includes(artifact.id);
    },
    onProgress(artifact, progress) {
      this.$set(this.downloadingProgress, artifact.id, progress);
    },
    async download(artifact) {
      this.activeArtifacts.push(artifact.id);
      try {
        if (!artifact.object_name && artifact.url) {
          window.open(artifact.url, '_blank');
          return;
        }

        const downloadUrl = await this.downloadArtifact({
          productId: this.order.product.id,
          artifactId: artifact.id
        });
        if (this.error.downloadArtifact) {
          this.send({
            message: this.error.downloadArtifact.message,
            type: 'bg-danger',
            icon: 'ni-alert-circle'
          });
          return;
        }

        const filename = downloadUrl.split('/').pop().split('#')[0].split('?')[0];
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        link.click();
      } finally {
        this.activeArtifacts = this.activeArtifacts.filter((id) => id !== artifact.id);
      }
    },
    async decryptfile(objFile) {
      if (this.publicKeyV2) {
        return await this.decryptfileV2(objFile);
      } else {
        return await this.decryptfileLegacy(objFile);
      }
    },
    async decryptfileV2(objFile) {
      const cipherbytes = await readfile(objFile)
          .catch((err) => {
            console.error(err);
          });

      const encryptedPrivateKeyObj = JSON.parse(this.encryptedPrivateKeyV2);
      const symmetricalKeySalt = encryptedPrivateKeyObj.salt;
      await this.$wallet.provider.send('eth_requestAccounts', []);
      const storageEncryptionKey = (await this.$encryption.getSymmetricalKeyFromSignature(this.$wallet.provider.getSigner(), symmetricalKeySalt)).symmetricalKey;

      const privateKey = this.$encryption.symmetricalDecrypt(
        encryptedPrivateKeyObj.data,
        storageEncryptionKey
      ).data;

      const plaintextbytes = this.$encryption.decrypt({encryptedData: cipherbytes, publicKey: this.publicKeyV2, privateKey});

      if (!plaintextbytes) {
        console.error('Error decrypting file.');
        throw Error()
      }

      console.log('ciphertext decrypted');

      const blob = new Blob([plaintextbytes], {type: 'application/download'});
      const blobUrl = URL.createObjectURL(blob);

      // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
      return new Promise((resolve, reject) => {
        resolve(blobUrl);
      });
    },
    async decryptfileLegacy(objFile) {
      try {
        const cipherbytes = await readfile(objFile)
          .catch((err) => {
            console.error(err);
          });

        if (!this.$wallet.account) {
          await this.$wallet.connect();
        }

        const privateKeyStr = await window.ethereum.request({
          method: 'eth_decrypt',
          params: [this.encryptedPrivateKey, this.$wallet.account]
        });

        const privateKey = new Uint8Array(privateKeyStr.split(',').map((item) => parseInt(item)));

        const plaintextbytes = nacl.sealedbox.open(new Uint8Array(cipherbytes), decodeBase64(this.publicKey), privateKey);

        if (!plaintextbytes) {
          console.error('Error decrypting file.');
          throw Error()
        }

        console.log('ciphertext decrypted');

        const blob = new Blob([plaintextbytes], {type: 'application/download'});
        const blobUrl = URL.createObjectURL(blob);

        // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
        return new Promise((resolve, reject) => {
          resolve(blobUrl);
        });
      } catch (err) {
        this.send({
          message: err?.message || 'Failed to decrypt file.',
          type: 'bg-danger',
          icon: 'ni-alert-circle'
        });
      }
    },
    async downloadAndDecrypt(artifact) {
      if (!artifact.object_name && artifact.url) {
        window.open(artifact.url, '_blank');
        return;
      }
      this.activeArtifact = artifact;
      this.activeArtifacts.push(artifact.id);
      const downloadUrl = await this.downloadOrderArtifact({artifactId: artifact.id});
      this.activeArtifact = null;
      this.activeArtifacts = this.activeArtifacts.filter((id) => id !== artifact.id);
      if (this.orderArtifactError.downloadArtifact) {
        this.send({
          message: this.orderArtifactError.downloadArtifact.message,
          type: 'bg-danger',
          icon: 'ni-alert-circle'
        });
        return;
      }

      this.downloadingArtifacts.push(artifact.id);
      axios.get(downloadUrl, {
        responseType: 'blob',
        headers: {'X-Requested-With': 'XMLHttpRequest', 'Content-Type': 'application/octet-stream'},
        onDownloadProgress: progressEvent => {
          const total = parseFloat(progressEvent.total);
          const current = parseFloat(progressEvent.loaded);
          const percentCompleted = current / total * 100;
          this.onProgress(artifact, percentCompleted);
        }
      })
        .then(response => {
          const filename = downloadUrl.split('/').pop().split('#')[0].split('?')[0];
          const blob = new Blob([response.data]);
          const file = new File([blob], filename);
          this.downloadingArtifacts = this.downloadingArtifacts.filter((id) => id !== artifact.id);
          this.decryptingArtifacts.push(artifact.id);
          this.decryptfile(file).then((blobUrl) => {
            if (!blobUrl) {
              return;
            }
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            link.click();
            URL.revokeObjectURL(link.href);
          }).catch((e) => {
            console.error(e);
          }).finally(() => {
            this.decryptingArtifacts = this.decryptingArtifacts.filter((id) => id !== artifact.id);
          });
        }).catch((e) => {
        console.error(e);
      }).finally(() => {
        this.downloadingArtifacts = this.downloadingArtifacts.filter((id) => id !== artifact.id);
        this.downloadingProgress[artifact.id] = 0;
      });
    },
    async submit(artifact) {
      await this.submitArtifact({orderId: this.order.id, artifactId: artifact.id});
      if (this.error.submitArtifact) {
        this.send({
          message: this.error.submitArtifact.message,
          type: 'bg-danger',
          icon: 'ni-alert-circle'
        });
      } else {
        this.send({
          message: 'Submission queued, please wait for a minute',
          type: 'bg-success',
          icon: 'ni-check'
        });
      }
    },
    async handleSendUploadReminder() {
      await this.sendUploadReminder({orderId: this.order.id});
      if (this.orderError.sendUploadReminder) {
        this.send({
          message: this.orderError.sendUploadReminder.message,
          type: 'bg-danger',
          icon: 'ni-alert-circle'
        });
      } else {
        this.send({
          message: 'Reminder sent',
          type: 'bg-success',
          icon: 'ni-check'
        });
      }
    }
  },
  beforeDestroy() {
    this.modal?.hide();
  },
  setup(props) {
    const {
      artifacts,
      search,
      downloadArtifact,
      submitArtifact,
      loading,
      error
    } = useProductArtifact(`${props.order.product.id}`);
    const {
      artifacts: orderArtifacts, search: searchOrderArtifacts, downloadArtifact: downloadOrderArtifact,
      submitArtifact: submitOrderArtifact, loading: orderArtifactLoading, error: orderArtifactError
    } = useOrderArtifact(`${props.order.id}`);
    const {sendUploadReminder, loading: orderLoading, error: orderError} = useUserOrder(`${props.order.id}`);
    const {send} = useUiNotification();

    search({productId: props.order.product.id});
    searchOrderArtifacts({orderId: props.order.id});

    const downloadingArtifacts = ref([]);
    const decryptingArtifacts = ref([]);
    const activeArtifacts = ref([]);

    const getStatusTextClass = (artifact) => {
      const status = artifact?.state;
      switch (status) {
        case 'failed':
          return 'bg-danger';
        case 'pending':
          return 'bg-warning';
        case 'active':
          return 'bg-success';
        default:
          return '';
      }
    };

    return {
      artifacts: computed(() => artifacts ? artifacts.value : null),
      orderArtifacts: computed(() => orderArtifacts ? orderArtifacts.value : null),
      loading,
      orderArtifactLoading,
      error,
      orderArtifactError,
      sendUploadReminder,
      orderLoading,
      orderError,
      send,
      downloadArtifact,
      downloadOrderArtifact,
      submitArtifact,
      submitOrderArtifact,
      orderGetters,
      artifactGetters,
      downloadingArtifacts,
      decryptingArtifacts,
      activeArtifacts,
      getStatusTextClass,
      search,
      searchOrderArtifacts
    };
  }
};
</script>

<style lang="css" scoped>
</style>

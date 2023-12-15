<template>
  <q-page>
    <div class="row">
      <div class="col q-ma-md">
        <q-input
          v-model="token"
          outlined
          label="Token"
          hint="Add your user token"
          :error="isInvalidToken"
          error-message="Invalid token"
          @update:model-value="onTokenUpdate"
          @keyup.enter="onSubmit"
        />
      </div>
    </div>
    <div class="row q-mx-md q-mt-md">
      <q-btn
        class="full-width"
        color="primary"
        label="submit"
        @click="onSubmit"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { LocalStorage } from 'quasar'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from 'src/api/client'

const router = useRouter()
const token = ref('')
const isInvalidToken = ref(false)

async function onSubmit () {
  await sendTokenValidateAndRouterPush()
}

async function sendTokenValidateAndRouterPush () {
  LocalStorage.remove('pc_token')
  LocalStorage.set('pc_token', token.value)

  const response = await api.getMe()

  if (!response.success) {
    isInvalidToken.value = true
    LocalStorage.remove('pc_token')
    return
  }

  if (response.data?.role === 'admin') {
    router.push('/playlists')
    return
  }

  router.push('/queue')
}

function onTokenUpdate () {
  isInvalidToken.value = false
}
</script>

<style scoped></style>

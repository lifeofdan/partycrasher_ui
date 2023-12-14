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
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const token = ref('')
const isInvalidToken = ref(false)

function onSubmit () {
  isInvalidToken.value = sendTokenAndValidate()

  if (isInvalidToken.value) {
    return
  }

  if (token.value === 'admin') {
    router.push('/playlists')
  } else {
    router.push('/queue')
  }
}

function sendTokenAndValidate () {
  // do api call

  return false
}

function onTokenUpdate () {
  isInvalidToken.value = false
}
</script>

<style scoped></style>

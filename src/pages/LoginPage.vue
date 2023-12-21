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
          :error-message="errorMessage"
          @update:model-value="onTokenUpdate"
          @keyup.enter="onSubmit"
        />
      </div>
      <div class="col q-ma-md">
        <q-input
          v-model="loginToken"
          outlined
          label="Login Token"
          mask="A-A#-##A"
          :error-message="errorMessage"
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
import { useAuthStore } from 'src/stores/auth'

const router = useRouter()
const token = ref('')
const isInvalidToken = ref(false)
const loginToken = ref('')
const errorMessage = ref('')

async function onSubmit () {
  await sendTokenValidateAndRouterPush()
}

async function sendTokenValidateAndRouterPush () {
  // const response = await useAuthStore().fetchMe()
  const response = await useAuthStore().authenticate(loginToken.value, token.value)

  if (typeof response === 'string') {
    isInvalidToken.value = true
    errorMessage.value = response
    return
  }

  const goto = {
    admin: 'app.playlists',
    user: 'app.queue'
  }

  console.log(response.role, goto[response.role || 'user'])

  router.push({ name: goto[response.role || 'user'] })
}

function onTokenUpdate () {
  isInvalidToken.value = false
}
</script>

<style scoped></style>

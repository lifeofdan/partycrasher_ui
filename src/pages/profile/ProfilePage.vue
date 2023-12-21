<template>
  <q-page>
    <div class="row">
      <div class="col q-ma-md">
        <div class="row q-mb-xl">
          <div class="col text-center">
            <q-avatar
              size="180px"
              font-size="52px"
              color="teal"
              text-color="white"
              icon="person"
            />
          </div>
        </div>
        <div class="row">
          <div class="col">
            <p><strong>NAME: </strong>{{ authStore.state.me?.name ?? "&nbsp;" }}</p>
            <p><strong>ROLE: </strong>{{ authStore.state.me?.role ?? "&nbsp;" }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="row absolute-bottom">
      <div class="col q-ma-md">
        <q-btn
          color="negative"
          label="Logout"
          class="full-width"
          @click="onLogout"
        />
      </div>
    </div>

    <q-dialog
      v-model="confirm"
      persistent
    >
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Are you sure you want to log out?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            v-close-popup
            flat
            no-caps
            label="Cancel"
            color="primary"
          />
          <q-btn
            flat
            no-caps
            label="Yes, logout."
            color="primary"
            @click="logOut"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { LocalStorage } from 'quasar'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'

const router = useRouter()
const confirm = ref(false)
const authStore = useAuthStore()

function onLogout () {
  confirm.value = true
}

async function logOut () {
  LocalStorage.clear()
  await router.push({ name: 'login' })
}

</script>

<style scoped>

</style>

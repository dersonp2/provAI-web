<template>
  <q-layout view="hHh lpR lFr">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-icon name="history_edu" />
          ProvA.I
        </q-toolbar-title>

        <div>V{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-primary text-white" :width="200"
      :breakpoint="767">
      <q-list>
        <q-item-label header>
          Navegação
        </q-item-label>

        <navLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import NavLink from 'components/nav/NavLink.vue';

const linksList = [
  {
    title: 'Inicio',
    icon: 'home',
    link: '/'
  },
  {
    title: 'Prova',
    icon: 'description',
    link: '/gerador/prova'
  },
  {
    title: 'Configuração',
    icon: 'settings',
    link: '/configuracao'
  }
];

export default defineComponent({
  name: 'MainLayout',

  components: {
    NavLink
  },

  setup() {
    const leftDrawerOpen = ref(false)

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
});
</script>

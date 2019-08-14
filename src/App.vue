<template>
  <v-app>
    <v-container fluid>
      <router-view></router-view>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data: () => ({
    //
  })
};
</script>
<style>
body {
  background: #d4dde2;
}
</style>

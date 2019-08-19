<template>
  <v-layout column>
    <v-row align="center" align-content="center">
      <v-col cols="10"></v-col>
      <v-col cols="2">
        <v-img src="@/assets/img/logo.png"></v-img>
      </v-col>
    </v-row>
    <v-spacer></v-spacer>
    <v-row align="center" align-content="center">
      <v-col cols="6">
        <v-img src="@/assets/img/profile.gif"></v-img>
      </v-col>
      <v-col cols="6">
        <h1 class="font-weight-black text-center red--text">Access Denied</h1>
        <p class="font-weight-black text-center">Information does not match our records</p>
      </v-col>
    </v-row>
    <v-row align="center" align-content="center">
      <v-col cols="12" v-if="type === 'face'">
        <p class="font-weight-black text--primary text-center">Please try fingerprint</p>
      </v-col>
      <v-col cols="12" v-if="type === 'fingerprint'">
        <p class="font-weight-black text--primary text-center">Please see admin</p>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
import io from "socket.io-client";
import { setTimeout } from "timers";
export default {
  name: "access-denied",
  props: ["type"],
  data: () => ({
    // message: "",
    socket: io("localhost:5000", { transports: ["websocket"] })
  }),
  methods: {
    // getData() {
    //   this.socket.on("access_denied_data", data => {
    //     this.message = JSON.parse(data);
    //     if (this.message === "face") {
    //       setTimeout(() => {
    //         this.$router.push({ path: "/fingerprint" });
    //       }, 5000);
    //     } else {
    //       setTimeout(() => {
    //         this.$router.push({ path: "/" });
    //       }, 5000);
    //     }
    //   });
    // }
  },
  mounted() {
    this.socket.emit("join_room", "room_blink");
    // this.getData();
    if (this.type === "face") {
      setTimeout(() => {
        this.$router.push({ path: "/fingerprint" });
      }, 5000);
    } else {
      setTimeout(() => {
        this.socket.emit("blink_event", "mulai");
        this.$router.push({ path: "/" });
      }, 5000);
    }
  },
  beforeDestroy() {
    this.socket.emit("leave_room", "room_blink");
  }
};
</script>

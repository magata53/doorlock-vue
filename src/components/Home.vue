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
        <v-img src="@/assets/img/logo.png"></v-img>
      </v-col>
      <v-col cols="6">
        <h1 class="font-weight-black text-center">Welcome,</h1>
        <p class="font-weight-black text-center">Please position your face/fingerprint for scanning</p>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
import io from "socket.io-client";
export default {
  data: () => ({
    socket: io("localhost:5000", { transports: ["websocket"] })
  }),
  methods: {
    getData() {
      this.socket.on("blink_data", data => {
        if (data === "mulai") {
          // do something
        } else {
          this.$router.push({ path: "/face" });
        }
      });
    }
  },
  mounted() {
    this.socket.emit("join_room", "room_blink");
    this.getData();
  },
  beforeDestroy() {
    this.socket.emit("leave_room", "room_blink");
  }
};
</script>

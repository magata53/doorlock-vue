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
      <v-col cols="6" v-if="message === ''">
        <v-img src="@/assets/img/fingerprint.png"></v-img>
      </v-col>
      <v-col cols="6" v-if="message">
        <v-img :src="message.link"></v-img>
      </v-col>
      <v-col cols="6">
        <h1 class="font-weight-black text-center">Welcome,</h1>
        <p
          class="font-weight-black text-center"
          v-if="message === ''"
        >Please position your fingerprint for scanning</p>
        <p class="font-weight-black text-center" v-if="message">{{message.name}}</p>
      </v-col>
    </v-row>
    <v-row align="center" align-content="center">
      <v-col cols="12" v-if="message">
        <p class="font-weight-black text-center blue--text">Please enter</p>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
import io from "socket.io-client";
import { setTimeout } from "timers";
export default {
  data: () => ({
    message: "",
    socket: io("localhost:5000", { transports: ["websocket"] })
  }),
  methods: {
    getData() {
      this.socket.on("fingerprint_data", data => {
        this.message = JSON.parse(data);
        setTimeout(() => {
          this.$router.push({ path: "/" });
        }, 4000);
      });
    },
    checkAccess() {
      this.socket.on("access_denied_data", data => {
        if (data) {
          setTimeout(() => {
            this.$router.push({
              name: "access-denied",
              params: { type: data }
            });
          }, 3000);
        }
      });
    }
  },
  mounted() {
    this.socket.emit("join_room", "room_fingerprint");
    this.socket.emit("join_room", "room_access_denied");
    this.getData();
    this.checkAccess();
  },
  beforeDestroy() {
    this.socket.emit("leave_room", "room_fingerprint");
    this.socket.emit("leave_room", "room_access_denied");
  }
};
</script>

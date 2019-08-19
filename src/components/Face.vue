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
        <vue-web-cam
          ref="webcam"
          :device-id="deviceId"
          @cameras="onCameras"
          @started="onStarted"
          witdh="300"
          height="350"
        ></vue-web-cam>
      </v-col>
      <v-col cols="6" v-if="message">
        <v-img :src="message.link"></v-img>
      </v-col>
      <v-col cols="6">
        <h1 class="font-weight-black text-center">Welcome,</h1>
        <p
          class="font-weight-black text-center"
          v-if="message === ''"
        >Please position your face for scanning</p>
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
import { WebCam } from "vue-web-cam";
import { setTimeout } from "timers";
export default {
  name: "face",
  components: {
    "vue-web-cam": WebCam
  },
  data: () => ({
    message: "",
    deviceId: null,
    img: null,
    camera: null,
    devices: [],
    socket: io("localhost:5000", { transports: ["websocket"] })
  }),
  watch: {
    camera: function(id) {
      this.deviceId = id;
    },
    devices: function() {
      // Once we have a list select the first one
      const [first, ...tail] = this.devices;
      if (first) {
        this.camera = first.deviceId;
        this.deviceId = first.deviceId;
      }
    }
  },
  methods: {
    getData() {
      this.socket.on("face_data", data => {
        if (data) {
          this.message = {
            link: `data:image/jpeg;base64,${JSON.parse(data).link}`,
            name: JSON.parse(data).name
          };
          this.$refs.webcam.stop();
          this.socket.emit("blink_event", "mulai");
          setTimeout(() => {
            this.$router.push({ path: "/" });
          }, 4000);
        }
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
          });
        }
      });
    },
    onCapture() {
      this.img = this.$refs.webcam.capture();
      setTimeout(() => {
        this.socket.emit("image", this.img);
      }, 100);
    },
    onStarted(stream) {
      setTimeout(() => {
        if (stream) {
          this.onCapture();
        }
      }, 5000);
    },
    onCameras(cameras) {
      this.devices = cameras;
    }
  },
  mounted() {
    this.socket.emit("join_room", "room_face");
    this.socket.emit("join_room", "room_access_denied");
    this.socket.emit("join_room", "room_blink");
    this.getData();
    this.checkAccess();
  },
  beforeDestroy() {
    this.socket.emit("leave_room", "room_face");
    this.socket.emit("leave_room", "room_access_denied");
    this.socket.emit("leave_room", "room_blink");
  }
};
</script>

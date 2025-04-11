import { createApp } from "vue";
import { GraffitiLocal } from "@graffiti-garden/implementation-local";
import { GraffitiRemote } from "@graffiti-garden/implementation-remote";
import { GraffitiPlugin } from "@graffiti-garden/wrapper-vue";

const channels = ["designftw"];

createApp({
  data() {
    return {
      myMessage: "",
      sentMessageObjects: [],
      messageObjects: [],
      isSending: false
    };
  },

  methods: {
    async sendMessage(session) {
        if (this.myMessage.length) {
            this.isSending = true;
            const promise =  new Promise((resolve) => setTimeout(resolve, 1000));
            var svg = document.querySelector(".loading") 
            svg.style.display = "inline"

            promise.then(() => {
                this.isSending = false;
                svg.style.display = "none"
            })

            await this.$graffiti.put(
                {
                    value: {
                        content: this.myMessage,
                        published: Date.now(),
                    },
                    channels,
                },
                session,
            );

            this.myMessage = "";
            this.getMessages()

        } else {
            console.log("Must include a message")
        }
    },

    async getMessages() {
      const newMessageObjects = [];
        const messageObjectsIterator = this.$graffiti.discover(channels, {
            value: {
                properties: {
                    content: { type: "string" },
                    published: { type: "number" },
                },
            },
        });
        for await (const { object } of messageObjectsIterator) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            newMessageObjects.push(object);
        }
      // Sort here

      this.messageObjects = newMessageObjects;
    },

  },
})
  .use(GraffitiPlugin, {
    // graffiti: new GraffitiLocal(),
    graffiti: new GraffitiRemote(),
  })
  .mount("#app");

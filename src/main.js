import "./assets/styles/base.scss"
import "./assets/styles/text.scss"
import "./assets/styles/flex.scss"

import { createApp } from "vue"
import { createPinia } from "pinia"

import App from "./App.vue"
import router from "./router"

import Flex from "@/components/Flex.vue"
import Text from "@/components/Text.vue"
import Icon from "@/components/Icon.vue"

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.component("Flex", Flex)
app.component("Text", Text)
app.component("Icon", Icon)

app.mount("#app")

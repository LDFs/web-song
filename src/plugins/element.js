import { createApp } from 'vue'

import {
  Container,
  Header,
  Aside,
  Main,
  Footer,
  Button,
  Input
} from 'element-plus'

import {
  Search,
  ElIcon
} from '@element-plus/icons-vue'

const app = createApp(App)

app.use(Container)
app.use(Header)
app.use(Aside)
app.use(Main)
app.use(Footer)
app.use(Button)
app.use(Input)

app.use(ElIcon)
app.use(Search)

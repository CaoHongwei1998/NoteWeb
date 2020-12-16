import Vue from 'vue'
import { Button, Form, FormItem, Input ,Select,Option,Card,Divider,Table,TableColumn,DatePicker,Tooltip,Dialog,MessageBox} from 'element-ui'

//弹框
import {Message} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Select)
Vue.use(Option)
Vue.use(Card)
Vue.use(Divider)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(DatePicker)
Vue.use(Tooltip)
Vue.use(Dialog)

//全局 通过$message $confirm访问
Vue.prototype.$message =Message
Vue.prototype.$confirm =MessageBox.confirm

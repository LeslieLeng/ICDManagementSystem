import IcdManage from '../components/IcdManage'
import BusManage from '../components/BusManage'
import Home from '../components/Home'
import Login from '../components/Login'

import AllInfo from '../components/IcdComp/AllInfo'
import EditIcd from '../components/IcdComp/EditIcd'
import ExportIcd from '../components/IcdComp/ExportIcd'
import ImportIcd from '../components/IcdComp/ImportIcd'

import Discrete from '../components/busComp/Discrete'
import BusA429 from '../components/busComp/BusA429'
import BusA664 from '../components/busComp/BusA664'

import A429Monitor from "../components/busComp/A429/A429Monitor"
import A429PlayBack from '../components/busComp/A429/A429PlayBack'
import A664Monitor from "../components/busComp/A664/A664Monitor"
import A664PlayBack from '../components/busComp/A664/A664PlayBack'
import Simulate from '../components/busComp/Simulate'

export const routes=[
    {path:'/',component:Home},
    {path:'/login',component:Login},
    {path:'/icdmanage',redirect: {name: 'editicd'},component:IcdManage,meta: {keepAlive: true},children:[
        {path:'/allinfo',name:'allinfo',component:AllInfo,meta: {keepAlive: true}},
        {path:'/editicd',name:'editicd',component:EditIcd,meta: {keepAlive: true}},
        {path:'/exporticd',name:'exporticd',component:ExportIcd,meta: {keepAlive: true}},
        {path:'/importicd',name:'importicd',component:ImportIcd,meta: {keepAlive: true}},]},
    {path:'/bus',component:BusManage,redirect:{name:'busa429'},meta: {keepAlive: true},children: [
        {path:'/busa429',name:'busa429',component:BusA429,redirect:{name:'a429monitor'},meta: {keepAlive: true},children:[
            {path:'/a429monitor',name:'a429monitor',component:A429Monitor,meta: {keepAlive: true}},
            {path:'/a429playback',name:'a429playback',component:A429PlayBack,meta: {keepAlive: true}},
          ]},
        {path:'/busa664',name:'busa664',component:BusA664,redirect:{name:'a664monitor'},meta: {keepAlive: true},children:[
            {path:'/a664monitor',name:'a664monitor',component:A664Monitor,meta: {keepAlive: true}},
            {path:'/a664playback',name:'a664playback',component:A664PlayBack,meta: {keepAlive: true}},
          ]},
        {path:'/discrete',name:'discrete',component:Discrete,meta: {keepAlive: true}}
    ]},
  {path:'/simulate',name:'simulate',component:Simulate,meta: {keepAlive: true}},
]

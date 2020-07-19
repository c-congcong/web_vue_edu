import Vue from "vue"

import Vuex from "vuex"

Vue.use(Vuex);
export default new Vuex.Store({
    state:{
        // 购物车数据
        cart_length:'',
        order_length:'',
    },
    mutations:{
        add_cart(state,data){
            state.cart_length = data;
        },
        add_order(state,data){
            state.cart_length = data;
        },

    }
})

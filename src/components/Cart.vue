<template>
    <div class="cart">
        <Header></Header>
        <div class="cart_info">
            <div class="cart_title">
                <span class="text">我的购物车</span>
                <span class="total">共{{this.$store.state.cart_length}}门课程</span>
            </div>
            <div class="cart_table">
                <div class="cart_head_row">
                    <span class="doing_row"></span>
                    <span class="course_row">课程</span>
                    <span class="expire_row">有效期</span>
                    <span class="price_row">单价</span>
                    <span class="do_more">操作</span>
                </div>
                <div class="cart_course_list">
                    <CartItem v-for="(course,index) in cart_list" :key="index" :course="course"
                              @delete_course="del_cart(index)" @change_select="price_all"></CartItem>
                </div>
                <div class="cart_footer_row">
                    <span class="cart_select">
                        <label>
                            <span @click="change_all">
                                <el-checkbox v-model="selected"></el-checkbox>&nbsp&nbsp&nbsp&nbsp&nbsp
                            <span>全选</span>
                            </span>
                        </label>
                    </span>
                    <span class="cart_delete"><i class="el-icon-delete"></i>
                        <span @click="del_all">删除</span>
                    </span>
                    <router-link to="/order" class="goto_pay">去结算</router-link>
                    <span class="cart_total">总计：¥{{total_price | numFilter}}</span>
                </div>
            </div>
        </div>
        <Footer></Footer>
    </div>
</template>

<script>

    import CartItem from "./common/CartItem";
    import Header from "./common/Header";
    import Footer from "./common/Footer";


    export default {
        name: "cart",
        // watch: {
        //     'selected': function () {
        //         //切换状态
        //
        //     },
        // },
        data() {
            return {
                cart_list: [],
                selected: '',
                id: '',
                total_price: 0.00,
                total_prices: 0,
            }
        },
        filters: {
            numFilter(value) {
                let realVal = '';
                if (!isNaN(value) && value !== '') {
                    // 截取当前数据到小数点后两位
                    realVal = parseFloat(value).toFixed(2)
                } else {
                    realVal = '--'
                }
                return realVal
            }
        },
        created() {
            this.get_cart();
        },
        methods: {
            //商品总价格
            price_all() {
                let total = 0;
                //购物车商品总数 计数器num
                let length = this.$store.state.cart_length;
                let num = 0;
                this.cart_list.forEach((course, key) => {
                    //判断是否中
                    if (course.selected) {
                        total += parseFloat(course.real_price);
                        num++
                    }
                    this.total_price = total;
                });
                this.selected = num === length;
            },

            //全部删除
            del_all() {
                for (let m in this.cart_list) {
                    this.selected = this.cart_list[m].selected;
                    this.id = this.cart_list[m].id;
                    if (this.selected) {
                        let token = localStorage.user_token || sessionStorage.user_token;
                        this.$axios.delete(`${this.$settings.HOST}cart/option/${this.id}`, {
                            headers: {
                                "Authorization": "jwt " + token,
                            }
                        }).then(response => {
                            this.$message.success(response.data.message);
                            //刷新界面
                            location.reload();
                        }).catch(error => {
                            console.log(error.response);
                        });
                    }
                }
            },

            change_all() {
                if (this.selected) {
                    let token = this.user_login();
                    this.$axios.get(`${this.$settings.HOST}cart/option/`, {
                        headers: {
                            "Authorization": "jwt " + token,
                        }
                    }).then(response => {
                        this.cart_list = response.data;
                        this.cart_list.forEach((course, key) => {
                            course.selected = false;
                        });
                        this.$store.commit("add_cart", this.cart_list.length);
                        //计算总价
                        this.price_all();

                    }).catch(error => {
                        console.log(error.response);
                    })
                }else {
                    let token = this.user_login();
                    this.$axios.get(`${this.$settings.HOST}cart/option/`, {
                        headers: {
                            "Authorization": "jwt " + token,
                        }
                    }).then(response => {
                        this.cart_list = response.data;
                        this.cart_list.forEach((course, key) => {
                            course.selected = true;
                        });
                        this.$store.commit("add_cart", this.cart_list.length);
                        //计算总价
                        this.price_all();

                    }).catch(error => {
                        console.log(error.response);
                    })
                }
            },

            //全选反选
            // change_all1() {
            //     //获取复选框状态，如果复选框是选中状态，则不操作，否则改变选中状态为true
            //     //如果全部选中再次点击则变为全不选
            //     //遍历cart_list得到每条商品的选中状态
            //     //定义一个累加器
            //     let num = 0;
            //     for (let i in this.cart_list) {
            //         this.selected = this.cart_list[i].selected;
            //         this.id = this.cart_list[i].id;
            //         if (this.selected) {
            //             //不变 累加器 判断累加器最后跟cart_list的length是否相等 ，如果相等则全部都是选中的
            //             num++;
            //         } else {
            //             //改变选中状态
            //             let token = localStorage.user_token || sessionStorage.user_token;
            //             this.$axios.patch(`${this.$settings.HOST}cart/option/change_all/`, {
            //                 selected: this.selected,
            //                 course_id: this.id,
            //             }, {
            //                 headers: {
            //                     "Authorization": "jwt " + token,
            //                 }
            //             }).then(response => {
            //                 // this.$message.success(response.data.message);
            //                 let j = 10;
            //                 setInterval(() => {
            //                     if (j <= 1) {
            //                         //刷新界面
            //                         location.reload();
            //                     } else {
            //                         j--;
            //                     }
            //                 }, 100);
            //             }).catch(error => {
            //                 console.log(error.response);
            //             })
            //         }
            //     }
            //     if (num === this.cart_list.length) {
            //         for (let n in this.cart_list) {
            //             this.selected = this.cart_list[n].selected;
            //             this.id = this.cart_list[n].id;
            //             //改变选中状态
            //             let token = localStorage.user_token || sessionStorage.user_token;
            //             this.$axios.patch(`${this.$settings.HOST}cart/option/change_all/`, {
            //                 selected: this.selected,
            //                 course_id: this.id,
            //             }, {
            //                 headers: {
            //                     "Authorization": "jwt " + token,
            //                 }
            //             }).then(response => {
            //                 this.$message.success(response.data.message);
            //                 let j = 10;
            //                 setInterval(() => {
            //                     if (j <= 1) {
            //                         //刷新界面
            //                         location.reload();
            //                     } else {
            //                         j--;
            //                     }
            //                 }, 100);
            //             }).catch(error => {
            //                 console.log(error.response);
            //             })
            //         }
            //     }
            // },

            //墙灯
            user_login() {
                let token = localStorage.user_token || sessionStorage.user_token;
                if (!token) {
                    let self = this;
                    this.$confirm("对不起请先登录！", {
                        callback() {
                            self.$router.push("/home/login");
                        }
                    });
                    return false
                }
                return token;
            },

            //获取购物车
            get_cart() {
                let token = this.user_login();
                this.$axios.get(`${this.$settings.HOST}cart/option/`, {
                    headers: {
                        "Authorization": "jwt " + token,
                    }
                }).then(response => {
                    // console.log(response.data);
                    this.cart_list = response.data;
                    this.$store.commit("add_cart", this.cart_list.length);
                    //计算总价
                    this.price_all();

                }).catch(error => {
                    console.log(error.response);
                })
            },
            del_cart(key) {
                //从购物车删除指定商品
                this.cart_list.splice(key, 1);
                this.$store.commit("add_cart", this.cart_list.length);

                this.price_all();
            }
        },
        components: {
            CartItem: CartItem,
            Header: Header,
            Footer: Footer,
        }

    }
</script>

<style scoped>
    .cart_info {
        width: 1200px;
        margin: 0 auto 200px;
    }

    .cart_title {
        margin: 25px 0;
    }

    .cart_title .text {
        font-size: 18px;
        color: #666;
    }

    .cart_title .total {
        font-size: 12px;
        color: #d0d0d0;
    }

    .cart_table {
        width: 1170px;
    }

    .cart_table .cart_head_row {
        background: #F7F7F7;
        width: 100%;
        height: 80px;
        line-height: 80px;
        padding-right: 30px;
    }

    .cart_table .cart_head_row::after {
        content: "";
        display: block;
        clear: both;
    }

    .cart_table .cart_head_row .doing_row,
    .cart_table .cart_head_row .course_row,
    .cart_table .cart_head_row .expire_row,
    .cart_table .cart_head_row .price_row,
    .cart_table .cart_head_row .do_more {
        padding-left: 10px;
        height: 80px;
        float: left;
    }

    .cart_table .cart_head_row .doing_row {
        width: 78px;
    }

    .cart_table .cart_head_row .course_row {
        width: 530px;
    }

    .cart_table .cart_head_row .expire_row {
        width: 188px;
    }

    .cart_table .cart_head_row .price_row {
        width: 162px;
    }

    .cart_table .cart_head_row .do_more {
        width: 162px;
    }

    .cart_footer_row {
        padding-left: 30px;
        background: #F7F7F7;
        width: 100%;
        height: 80px;
        line-height: 80px;
    }

    .cart_footer_row .cart_select span {
        margin-left: -7px;
        font-size: 18px;
        color: #666;
    }

    .cart_footer_row .cart_delete {
        margin-left: 58px;
    }

    .cart_delete .el-icon-delete {
        font-size: 18px;
    }

    .cart_delete span {
        margin-left: 15px;
        cursor: pointer;
        font-size: 18px;
        color: #666;
    }

    .cart_total {
        float: right;
        margin-right: 62px;
        font-size: 18px;
        color: #666;
    }

    .goto_pay {
        float: right;
        width: 159px;
        height: 80px;
        outline: none;
        border: none;
        background: #ffc210;
        font-size: 18px;
        color: #fff;
        text-align: center;
        cursor: pointer;
    }
</style>

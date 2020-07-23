<template>
    <div class="user-order">
        <Header/>
        <div class="main">
            <div class="banner"></div>
            <div class="profile">
                <div class="profile-info">
                    <div class="avatar"><img class="newImg" width="100%" alt="" src="../../static/image/logo.png"></div>
                    <span class="user-name">Mixtea</span>
                    <span class="user-job">北京市 | Python</span>
                </div>
                <ul class="my-item">
                    <li>我的账户</li>
                    <li class="active">我的订单</li>
                    <li>个人资料</li>
                    <li>账号安全</li>
                </ul>
            </div>
            <div class="user-data">
                <ul class="nav">
                    <li class="order-info">订单</li>
                    <li class="course-expire">有效期</li>
                    <li class="course-price">课程价格</li>
                    <li class="real-price">实付金额</li>
                    <li class="order-status">交易状态</li>
                    <li class="order-do">交易操作</li>
                </ul>
                <div class="my-order-item" v-for="(i,index) in order_list" :key="index">
                    <div class="user-data-header">
                        <span class="order-time">{{$moment(i.create_time).format('YYYY-MM-DD  hh:mm:ss')}}</span>
                        <span class="order-num">订单号：
                        <span class="my-older-number">{{i.order.order_number}}</span>
                    </span>
                    </div>
                    <ul class="nav user-data-list">
                        <li class="order-info">
                            <img :src=i.course.course_img :alt=i.course.name>
                            <div class="order-info-title">
                                <p class="course-title">{{i.course.name}}</p>
                                <p class="price-service" v-if="i.discount_name">{{i.discount_name}}</p>
                            </div>
                        </li>
                        <li class="course-expire" v-if="i.expire===7">一个月</li>
                        <li class="course-expire" v-else-if="i.expire===8">三个月</li>
                        <li class="course-expire" v-else-if="i.expire===9">半年</li>
                        <li class="course-expire" v-else>永久</li>
                        <li class="course-price">{{i.order.total_price}}</li>
                        <li class="real-price">{{i.order.real_price}}</li>
                        <li class="order-status" v-if="i.order.order_status===0">{{minute}}:{{second}}</li>
                        <li class="order-status" v-else-if="i.order.order_status===1">交易成功</li>
                        <li class="order-status" v-else-if="i.order.order_status===2">已取消</li>
                        <li class="order-status" v-else>超时取消</li>
                        <li class="order-do">
                            <span class="btn btn2" v-if="i.order.order_status===1">去学习</span>
                            <span class="btn btn2" v-else-if="i.order.order_status===0">立即支付</span>
                            <span class="btn btn2" v-else>重新购买</span>
                            <span @click="del(i.order.id,index)">删除</span>
<!--                            <span @click="change(i.order.id)">取消</span>-->
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <Footer/>
    </div>
</template>

<script>
    import Header from "./common/Header"
    import Footer from "./common/Footer"

    export default {
        name: "OrderList",
        data() {
            return {
                order_list: [],
                active_time: 10,
                minutes: 30,
                seconds: 0
            };
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
            this.check_user();
            this.get_order_details();
            this.change_order();
            this.time_sub();
        },
        methods: {
            num: function (n) {
                return n < 10 ? '0' + n : '' + n
            },
            //倒计时
            time_sub() {
                var _this = this;
                var time = window.setInterval(function () {
                    if (_this.seconds === 0 && _this.minutes !== 0) {
                        _this.seconds = 59;
                        _this.minutes -= 1
                    } else if (_this.minutes === 0 && _this.seconds === 0) {
                        _this.seconds = 0;
                        window.clearInterval(time)

                    } else {
                        _this.seconds -= 1
                    }
                }, 1000)
            },

            change_order() {
                let token = localStorage.user_token || sessionStorage.user_token;
                this.$axios.get(`${this.$settings.HOST}order/get_list/`, {
                    headers: {
                        "Authorization": "jwt " + token,
                    }
                }).then(response => {
                    console.log(response.data);

                }).catch(error => {
                    console.log(error.response);
                })
            },

            change(id) {
                let token = localStorage.user_token || sessionStorage.user_token;
                this.$axios.patch(`${this.$settings.HOST}order/del_order/`, {
                    id :id
                },{
                    headers: {
                        "Authorization": "jwt " + token,
                    }
                }).then(response => {
                    this.get_order_details();
                    this.$message.success("更改成功！")
                }).catch(error => {
                    console.log(error.response);
                })
            },

            del(id, index) {
                let token = localStorage.user_token || sessionStorage.user_token;
                this.$axios.delete(`${this.$settings.HOST}order/del_order/` + id, {
                    headers: {
                        "Authorization": "jwt " + token,
                    }
                }).then(response => {
                    //从购物车删除指定商品
                    this.order_list.splice(index, 1);
                    this.get_order_details();
                    this.$message.success("删除订单成功！")
                }).catch(error => {
                    console.log(error.response);
                })
            },

            get_order_details() {
                let token = localStorage.user_token || sessionStorage.user_token;
                this.$axios.get(`${this.$settings.HOST}order/get/`, {
                    headers: {
                        "Authorization": "jwt " + token,
                    }
                }).then(response => {
                    console.log(response.data);
                    this.order_list = response.data;
                    this.$store.commit("add_order", response.data.length)
                }).catch(error => {
                    console.log(error.response);
                })
            },
            //墙灯
            check_user() {
                let token = localStorage.user_token || sessionStorage.user_token;
                if (!token) {
                    this.$alert("对不起，您尚未登录，请登录以后再进行购物车").then(() => {
                        this.$router.push("/home/login");
                    });
                    return false;
                }
                return token;
            },
        },
        watch: {
            second: {
                handler(newVal) {
                    this.num(newVal)
                }
            },
            minute: {
                handler(newVal) {
                    this.num(newVal)
                }
            }
        },
        computed: {
            second: function () {
                return this.num(this.seconds)
            },
            minute: function () {
                return this.num(this.minutes)
            }
        },
        components: {
            Header,
            Footer,
        }
    }
</script>

<style scoped>
    .main .banner {
        width: 100%;
        height: 324px;
        background: url(../../static/image/1001674.jpg) no-repeat;
        background-size: cover;
        z-index: 1;
    }

    .profile {
        width: 1200px;
        margin: 0 auto;
    }

    .profile-info {
        text-align: center;
        margin-top: -80px;
    }

    .avatar {
        width: 120px;
        height: 120px;
        border-radius: 60px;
        overflow: hidden;
        margin: 0 auto;
    }

    .user-name {
        display: block;
        font-size: 24px;
        color: #4a4a4a;
        margin-top: 14px;
    }

    .user-job {
        display: block;
        font-size: 11px;
        color: #9b9b9b;
    }

    .my-item {
        list-style: none;
        line-height: 1.42857143;
        color: #333;
        width: 474px;
        height: 31px;
        display: -ms-flexbox;
        display: flex;
        cursor: pointer;
        margin: 41px auto 0;
        -ms-flex-pack: justify;
        justify-content: space-between;
    }

    .my-item .active {
        border-bottom: 1px solid #000;
    }

    .user-data {
        width: 1200px;
        height: auto;
        margin: 0 auto;
        padding-top: 30px;
        border-top: 1px solid #e8e8e8;
        margin-bottom: 63px;
    }

    .nav {
        width: 100%;
        height: 60px;
        background: #e9e9e9;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-align: center;
        align-items: center;
    }

    .nav li {
        margin-left: 20px;
        margin-right: 28px;
        height: 60px;
        line-height: 60px;
        list-style: none;
        font-size: 13px;
        color: #333;
        border-bottom: 1px solid #e9e9e9;
        width: 160px;
    }

    .nav .order-info {
        width: 325px;
    }

    .nav .course-expire {
        width: 60px;
    }

    .nav .course-price {
        width: 130px;
    }

    .user-data-header {
        display: flex;
        height: 44px;
        color: #4a4a4a;
        font-size: 14px;
        background: #f3f3f3;
        -ms-flex-align: center;
        align-items: center;
    }

    .order-time {
        font-size: 12px;
        display: inline-block;
        margin-left: 20px;
    }

    .order-num {
        font-size: 12px;
        display: inline-block;
        margin-left: 29px;
    }

    .user-data-list {
        height: 100%;
        display: flex;
    }

    .user-data-list {
        background: none;
    }

    .user-data-list li {
        height: 60px;
        line-height: 60px;
    }

    .user-data-list .order-info {
        display: flex;
        align-items: center;
        margin-right: 28px;
    }

    .user-data-list .order-info img {
        max-width: 100px;
        max-height: 75px;
        margin-right: 22px;
    }

    .course-title {
        width: 203px;
        font-size: 13px;
        color: #333;
        line-height: 20px;
        margin-top: -10px;
    }

    .order-info-title .price-service {
        line-height: 18px;
    }

    .price-service {
        font-size: 12px;
        color: #fa6240;
        padding: 0 5px;
        border: 1px solid #fa6240;
        border-radius: 4px;
        margin-top: 4px;
        position: absolute;
    }

    .order-info-title {
        margin-top: -10px;
    }

    .user-data-list .course-expire {
        font-size: 12px;
        color: #ff5502;
        width: 60px;
        text-align: center;
    }

    .btn {
        width: 100px;
        height: 32px;
        font-size: 14px;
        color: #fff;
        background: #ffc210;
        border-radius: 4px;
        border: none;
        outline: none;
        transition: all .25s ease;
        display: inline-block;
        line-height: 32px;
        text-align: center;
        cursor: pointer;
    }
</style>

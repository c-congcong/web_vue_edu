<template>
    <div class="login box">
        <img src="../../static/image/1001821.jpg" alt="">
        <div class="login">
            <div class="login-title">
                <img src="../../static/image/logo.png" alt="">
                <p>百知教育给你最优质的学习体验!</p>
            </div>
            <div class="login_box">
                <div class="title">
                    <router-link to="/home/login">密码登录</router-link>
                    <span>短信登录</span>
                </div>
                <div class="inp" v-if="">
                    <input type="text" @blur="checkMobile" placeholder="手机号码" class="user" v-model="mobile">
                    <div class="sms-box">
                        <input v-model="code" type="text" maxlength="6" placeholder="输入验证码" class="user">
                        <div class="sms-btn" @click="get_code">{{sms_text}}</div>
                    </div>
                    <div id="geetest1"></div>
                    <button class="login_btn btn btn-primary" @click="sms_login">登录</button>
                    <p class="go_login">没有账号
                        <router-link to="/home/register">立即注册</router-link>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Smslogin",
        data() {
            return {
                sms_text: "请输入验证码", // 提示语
                sms_flag: false,    // 能否再次发送短信
                mobile: '',
                code:'',
            }
        },
        methods: {
            // 用户登录的方法
            sms_login() {
                this.$axios({
                    url: this.$settings.HOST + "user/sms_login/",
                    method: "post",
                    data: {
                        mobile: this.mobile,
                        sms_code: this.code,
                    }
                }).then(response => {
                    console.log(response.data);
                    this.$message({
                        message: '恭喜你，登录成功',
                        type: 'success'
                    });
                    // 保存用户信息完成注册后 自动登录
                    sessionStorage.username = response.data.username;
                    sessionStorage.user_token = response.data.token;
                    // 登录成功后返回首页
                    this.$router.push("/");
                }).catch(error => {
                    this.$message.error("手机号或验证码错误");
                })
            },
            // 检测手机号是否唯一
            checkMobile() {
                this.$axios({
                    url: this.$settings.HOST + "user/mobile1/" + `${this.mobile}`,
                    method: "get",
                }).catch(error => {
                    this.$message.error(error.response.data)
                })
            },

            // 为手机号获取验证码
            get_code() {

                // 验证手机号格式
                if (!/1[35689]\d{9}/.test(this.mobile)) {
                    this.$alert("手机号格式有误", "警告");
                    return false
                }

                this.$axios({
                    url: this.$settings.HOST + "user/sms/" + `${this.mobile}`,
                    method: "get",
                }).then(response => {
                    console.log(response.data);

                    // 成功则可以再次发送短信
                    this.sms_flag = true;
                    let interval = 60;
                    let timer = setInterval(() => {
                        if (interval <= 1) {
                            // 停止倒计时  允许发送短信
                            clearInterval(timer);
                            this.sms_flag = false; // 设置允许发送短信 false
                            this.sms_text = `点击发送短信`
                        } else {
                            interval--;
                            this.sms_text = `${interval}后可以点击发送`;
                        }
                    }, 1000)

                }).catch(error => {
                    console.log(error.response);
                    this.$message.error("当前手机号已经发送过短信")
                })
            },
        },
    }
</script>

<style scoped>
    .box {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
    }

    .box img {
        width: 100%;
        min-height: 100%;
    }

    .box .login {
        position: absolute;
        width: 500px;
        height: 400px;
        top: 0;
        left: 0;
        margin: auto;
        right: 0;
        bottom: 0;
        top: -338px;
    }

    .login .login-title {
        width: 100%;
        text-align: center;
    }

    .login-title img {
        width: 190px;
        height: auto;
    }

    .login-title p {
        font-family: PingFangSC-Regular;
        font-size: 18px;
        color: #fff;
        letter-spacing: .29px;
        padding-top: 10px;
        padding-bottom: 50px;
    }

    .login_box {
        width: 400px;
        height: auto;
        background: #fff;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .5);
        border-radius: 4px;
        margin: 0 auto;
        padding-bottom: 40px;
    }

    .login_box .title {
        font-size: 20px;
        color: #9b9b9b;
        letter-spacing: .32px;
        border-bottom: 1px solid #e6e6e6;
        display: flex;
        justify-content: space-around;
        padding: 50px 60px 0 60px;
        margin-bottom: 20px;
        cursor: pointer;
    }

    .login_box .title span:nth-of-type(1) {
        color: #4a4a4a;
        border-bottom: 2px solid #84cc39;
    }

    .inp {
        width: 350px;
        margin: 0 auto;
    }

    .inp input {
        border: 0;
        outline: 0;
        width: 100%;
        height: 45px;
        border-radius: 4px;
        border: 1px solid #d9d9d9;
        text-indent: 20px;
        font-size: 14px;
        background: #fff !important;
    }

    .inp input.user {
        margin-bottom: 16px;
    }

    .inp .rember {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        margin-top: 10px;
    }

    .inp .rember p:first-of-type {
        font-size: 12px;
        color: #4a4a4a;
        letter-spacing: .19px;
        margin-left: 22px;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-align: center;
        align-items: center;
        /*position: relative;*/
    }

    .inp .rember p:nth-of-type(2) {
        font-size: 14px;
        color: #9b9b9b;
        letter-spacing: .19px;
        cursor: pointer;
    }

    .inp .rember input {
        outline: 0;
        width: 30px;
        height: 45px;
        border-radius: 4px;
        border: 1px solid #d9d9d9;
        text-indent: 20px;
        font-size: 14px;
        background: #fff !important;
    }

    .inp .rember p span {
        display: inline-block;
        font-size: 12px;
        width: 100px;
        /*position: absolute;*/
        /*left: 20px;*/

    }

    .sms-box {
        position: relative;
    }

    #geetest {
        margin-top: 20px;
    }

    .login_btn {
        width: 100%;
        height: 45px;
        background: #84cc39;
        border-radius: 5px;
        font-size: 16px;
        color: #fff;
        letter-spacing: .26px;
        margin-top: 30px;
    }

    .inp .go_login {
        text-align: center;
        font-size: 14px;
        color: #9b9b9b;
        letter-spacing: .26px;
        padding-top: 20px;
    }

    .inp .go_login span {
        color: #84cc39;
        cursor: pointer;
    }

    .sms-btn {
        font-size: 14px;
        color: #ffc210;
        letter-spacing: .26px;
        position: absolute;
        right: 16px;
        top: 10px;
        cursor: pointer;
        overflow: hidden;
        background: #fff;
        border-left: 1px solid #484848;
        padding-left: 16px;
        padding-bottom: 4px;
    }
</style>

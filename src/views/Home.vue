<template>
<div class="home">
    <div class="header">
        <div class="header-content">
            <v-btn class="mx-1" small depressed color="#362F1F" style="color: #FEE3A8" @click="handleConnect">
                <span v-if="!address">{{ $t('连接钱包') }}</span>
                <v-badge color="#00ff00" dot inline left v-else>
                    <div class="text-truncate">{{ $t('已连接') }} {{ address | addressOmit }}</div>
                </v-badge>
            </v-btn>

            <v-menu offset-y v-model="showLanguage">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn class="mx-1" small depressed color="#362F1F" style="color: #FEE3A8" v-bind="attrs" v-on="on">
                        Language
                        <v-icon small v-if="!showLanguage">mdi-menu-down</v-icon>
                        <v-icon small v-else>mdi-menu-up</v-icon>
                    </v-btn>
                </template>
                <v-list subheader dense color="#362F1F" style="padding-bottom: 0">
                    <v-list-item dense v-for="lang in languages" :key="lang.key" @click="handleChangeLang(lang.key)">
                        <v-list-item-title style="color: #FEE3A8">{{ lang.name }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>

            <v-btn class="mx-1" small depressed color="#362F1F" style="color: #FEE3A8;min-width:unset;padding: 0 8px;">
                <v-icon small>mdi-information-outline</v-icon>
            </v-btn>
        </div>
    </div>
    <div class="main">
        <div class="logo">
            <img src="../assets/img_logo.png" alt="logo" />
        </div>

        <div class="line-divider">
            <hr />
        </div>

        <div class="boast">
            <p>{{ $t('世界上最好的100%去中心化国际众筹社区平台') }}</p>
            <p>{{ $t('智能合约技术的ETH金融理财游戏系统') }}</p>
            <p>{{ $t('公开 透明 公正') }}</p>
        </div>

        <div class="line-divider">
            <hr />
        </div>

        <div class="contract">{{ $t('智能合约') }}：{{ mainAddress }}</div>

        <div class="actions">
            <div style="width: 100%">
                <v-btn class="join" rounded depressed :loading="joinLoading" @click="handleJoin(defaultValue)">{{ $t('投入[%{value}]ETH参与游戏', { value: defaultValue }) }}</v-btn>
            </div>
            <div class="more">
                <div style="line-height: 20px">{{ $t('您还可以选择') }}：</div>
                <template v-if="account.joinLevel < 3">
                    <template v-if="lastDeposit == 0 || lastDeposit == 0.1 * ether">
                        <v-btn outlined color="#F5D897" x-small @click="handleJoin(0.1)">0.1 ETH</v-btn>
                    </template>

                    <template v-if="lastDeposit == 0 || lastDeposit == 0.1 * ether || lastDeposit == 0.5 * ether">
                        <v-btn outlined color="#F5D897" x-small @click="handleJoin(0.5)">0.5 ETH</v-btn>
                    </template>
                </template>

                <template v-if="lastDeposit >= 1 * ether">
                    <v-btn outlined color="#F5D897" x-small @click="handleJoin(lastDeposit)">{{lastDeposit | weiToEther}} ETH</v-btn>
                </template>
            </div>
        </div>

        <div class="line-divider" style="margin: 18px 0;">
            <hr />
        </div>

        <div class="pool">
            <div class="pool-warp">
                <div class="pool-name">{{ $t('X分红累积资金池') }}</div>
                <div class="pool-value">
                    <span style="margin-right: 8px">{{ prize | weiToEther }}</span>ETH
                </div>
            </div>
        </div>

        <div class="pool" style="margin-top: 20px">
            <div class="pool-warp">
                <div class="pool-name">{{ $t('X分红今日奖池') }}</div>
                <div class="pool-value">
                    <span style="margin-right: 8px">{{ prize * 0.3 | weiToEther }}</span>ETH
                </div>
            </div>
        </div>

        <div class="pool" style="margin-top: 30px">
            <div class="pool-warp">
                <div class="pool-value">
                    <div class="countdown" style="margin-top: 5px">
                        <div>{{ $t('开奖倒计时') }}</div>
                        <div class="countdown-item">{{ countdownHour | PrefixInteger(2) }}</div>:
                        <div class="countdown-item">{{ countdownMinute | PrefixInteger(2) }}</div>:
                        <div class="countdown-item">{{ countdownSecond | PrefixInteger(2) }}</div>
                    </div>
                </div>
            </div>
        </div>

        <v-row class="panels" style="margin-top: 20px">
            <v-col md="12" sm="12" cols="12">
                <v-card class="mx-auto">
                    <v-card-title>
                        <div class="left-border" />
                        {{ $t('我的团队资料') }}
                    </v-card-title>

                    <div class="pa-4">
                        <div class="list">
                            <div class="list-item">
                                <div class="list-item-title text-truncate">{{ $t('直推数量') }}</div>
                                <div class="list-item-value text-truncate">{{ account.invited || '-' }}</div>
                            </div>
                            <div class="list-item">
                                <div class="list-item-title text-truncate">{{ $t('今日直推ETH数量') }}</div>
                                <div class="list-item-value text-truncate">{{ account.dailyInvite && account.dailyInvite.amount || 0 | weiToEther }} ETH</div>
                            </div>
                        </div>
                    </div>
                </v-card>
            </v-col>

            <v-col md="12" sm="12" cols="12">
                <v-card class="mx-auto">
                    <v-card-title>
                        <div class="left-border" />
                        {{ $t('昨日X分红奖励') }}
                    </v-card-title>

                    <div class="pa-4">
                        <div class="list">
                            <div class="list-item">
                                <div class="list-item-title text-truncate">X 10</div>
                                <div class="list-item-value text-truncate">{{ yesterdayPrize[1] | weiToEther }} ETH</div>
                            </div>
                            <div class="list-item">
                                <div class="list-item-title text-truncate">X 20</div>
                                <div class="list-item-value text-truncate">{{ yesterdayPrize[2] | weiToEther }} ETH</div>
                            </div>
                            <div class="list-item">
                                <div class="list-item-title text-truncate">X 30</div>
                                <div class="list-item-value text-truncate">{{ yesterdayPrize[3] | weiToEther }} ETH</div>
                            </div>
                        </div>
                    </div>
                </v-card>
            </v-col>

            <v-col md="12" sm="12" cols="12">
                <v-card class="mx-auto">
                    <v-card-title>
                        <div class="left-border" />
                        {{ $t('我的收入') }}
                    </v-card-title>

                    <div class="pa-4">
                        <div class="list">
                            <div class="list-item">
                                <div class="list-item-title">{{ $t('分红倒计时') }}</div>
                                <div class="list-item-value">{{ getNextTakeTime }}</div>
                            </div>
                            <div class="list-item">
                                <div class="list-item-title">{{ $t('静态收益') }}</div>
                                <div class="list-item-value text-truncate">{{ account.staticBalance | weiToEther }} ETH</div>
                            </div>
                            <div class="list-item">
                                <div class="list-item-title">{{ $t('推荐收益') }}</div>
                                <div class="list-item-value">{{ account.inviteIncome | weiToEther }} ETH</div>
                            </div>
                            <div class="list-item">
                                <div class="list-item-title">{{ $t('动态收益') }}</div>
                                <div class="list-item-value">{{ account.dynamicIncome | weiToEther }} ETH</div>
                            </div>
                            <div class="list-item">
                                <div class="list-item-title">{{ $t('分红收益') }}</div>
                                <div class="list-item-value">{{ account.poolIncome | weiToEther }} ETH</div>
                            </div>
                            <div class="list-item">
                                <div class="list-item-title">{{ $t('300%出局余额') }}</div>
                                <div class="list-item-value">{{ outgoing | weiToEther }} ETH</div>
                            </div>
                            <div class="list-item">
                                <div class="list-item-title">{{ $t('解锁收益') }}</div>
                                <div class="list-item-value text-truncate">{{ account.unlockBalance | weiToEther }} ETH</div>
                            </div>

                            <!--
                            <div class="list-item">
                                <div class="list-item-title">{{ $t('解锁收益') }}</div>
                                <div class="list-item-value text-truncate">{{ statistics.unlock | weiToEther }} ETH</div>
                            </div>
                            -->

                            <div class="list-item">
                                <div class="list-item-title">{{ $t('当日提币限额') }}</div>
                                <div class="list-item-value text-truncate">{{ (account.maxIncome - account.income) | weiToEther }} ETH</div>
                            </div>
                        </div>

                        <div style="width: 100%;text-align: center;margin-top: 12px">
                            <v-btn class="withdraw" rounded min-height="42px" :loading="withdrawLoading" @click="handleWithdraw">{{ $t('点击提现') }}</v-btn>
                        </div>
                    </div>
                </v-card>
            </v-col>

            <v-col md="12" sm="12" cols="12">
                <v-card class="mx-auto">
                    <v-card-title>
                        <div class="left-border" />
                        {{ $t('复投收入') }}
                    </v-card-title>

                    <div class="pa-4">
                        <div class="list">
                            <div class="list-item">
                                <div class="list-item-title">{{ $t('总收益30％复投ETH') }}</div>
                                <div class="list-item-value text-truncate">{{ account.unlockIncome | weiToEther }} ETH</div>
                            </div>
                            <div class="list-item">
                                <div class="list-item-title">{{ $t('复投300％出局余额') }}</div>
                                <div class="list-item-value">{{ account.unlockIncome * 3 | weiToEther }} ETH</div>
                            </div>
                            <!--
                            <div class="list-item">
                                <div class="list-item-title">{{ $t('复投静态收益') }}</div>
                                <div class="list-item-value">{{ calculateUnlockIncome | weiToEther }} ETH</div>
                            </div>
                            -->
                        </div>
                        <!--
                        <div style="width: 100%;text-align: center;margin-top: 12px">
                            <v-btn class="withdraw" rounded min-height="42px" :loading="takeUnlockLoading" @click="handleTakeUnlock">{{ $t('点击提现') }}</v-btn>
                        </div>
              -->
                    </div>
                </v-card>
            </v-col>

            <v-col md="12" sm="12" cols="12">
                <v-card class="mx-auto">
                    <v-card-title>
                        <div class="left-border" />
                        {{ $t('推荐链接') }}
                    </v-card-title>

                    <div class="pa-4">
                        <div class="list">
                            <div class="list-item">
                                <div class="list-item-title text-truncate">{{ $t('我的推荐链接') }}</div>
                                <div class="list-item-value text-truncate">{{ referralLink }}</div>
                            </div>
                            <div class="list-item">
                                <div class="list-item-title text-truncate">{{ $t('推荐人') }}</div>
                                <div class="list-item-value text-truncate">{{ referrer | addressOmit }}</div>
                            </div>
                        </div>
                        <div style="width: 100%;text-align: center;margin-top: 12px">
                            <v-btn class="withdraw" rounded min-height="42px" @click="handleCopyLink">{{ $t('点击复制我的推荐链接') }}</v-btn>
                        </div>
                    </div>
                </v-card>
            </v-col>

            <v-col md="12" sm="12" cols="12">
                <v-card class="mx-auto">
                    <v-card-title>
                        <div class="left-border" />
                        {{ $t('收益统计') }}
                    </v-card-title>

                    <div class="pa-4">
                        <div class="list">
                            <div class="list-item">
                                <div class="list-item-title text-truncate">{{ $t('ETH投资总数') }}</div>
                                <div class="list-item-value text-truncate">{{ statistics.investment | weiToEther }} ETH</div>
                            </div>
                            <div class="list-item">
                                <div class="list-item-title text-truncate">{{ $t('ETH收益总数') }}</div>
                                <div class="list-item-value text-truncate">{{ statistics.income | weiToEther }} ETH</div>
                            </div>
                            <div class="list-item">
                                <div class="list-item-title text-truncate">{{ $t('静态收益总数') }}</div>
                                <div class="list-item-value text-truncate">{{ statistics.statics | weiToEther }} ETH</div>
                            </div>
                            <div class="list-item">
                                <div class="list-item-title text-truncate">{{ $t('推荐收益总数') }}</div>
                                <div class="list-item-value text-truncate">{{ statistics.invite | weiToEther }} ETH</div>
                            </div>
                            <div class="list-item">
                                <div class="list-item-title text-truncate">{{ $t('动态收益总数') }}</div>
                                <div class="list-item-value text-truncate">{{ statistics.dynamic | weiToEther }} ETH</div>
                            </div>
                            <div class="list-item">
                                <div class="list-item-title text-truncate">{{ $t('分红收益总数') }}</div>
                                <div class="list-item-value text-truncate">{{ statistics.pool | weiToEther }} ETH</div>
                            </div>
                        </div>
                    </div>
                </v-card>
            </v-col>
        </v-row>
    </div>

    <v-dialog v-model="joinLoading" persistent width="300">
        <v-card color="primary" dark>
            <v-card-text>
                {{ $t('正在处理，请稍后') }}
                <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
            </v-card-text>
        </v-card>
    </v-dialog>
</div>
</template>

<script>
import Web3 from "web3";
import Decimal from "decimal.js";
import config from "@/config";
import {
    setDefaultLocale
} from "@/i18n";

const ether = Web3.utils.toWei("1", "ether");
const zeroAddr = "0x0000000000000000000000000000000000000000";
const minWithdraw = new Decimal(Web3.utils.toWei("0.008", "ether"));

export default {
    name: "Home",
    computed: {
        enabled() {
            return this.$store.state.enabled;
        },
        funds() {
            return this.$store.state.funds;
        },
        prize() {
            return this.$store.state.prize;
        },
        yesterdayPrize() {
            return this.$store.state.yesterdayPrize;
        },
        defaultValue() {
            if (this.account.lastDeposit == 0.1 * ether) {
                return 0.5;
            }

            if (this.account.lastDeposit == 0.5 * ether) {
                return 1;
            }

            if (this.account.id > 0) {
                return parseInt(this.account.joinLevel) + 1;
            }

            return 1;
        },
        countdownHour() {
            let v = parseInt((this.$store.state.countdown - this.now) / (60 * 60));
            return v < 0 ? 0 : v;
        },
        countdownMinute() {
            let v = parseInt((this.$store.state.countdown - this.now) / 60);
            return v < 0 ? 0 : v % 60;
        },
        countdownSecond() {
            let v = parseInt(this.$store.state.countdown - this.now);
            return v < 0 ? 0 : v % 60;
        },
        address() {
            return this.$store.state.address;
        },
        account() {
            // console.log("this.$store.state.account=", this.$store.state.account)
            return this.$store.state.account;
        },
        statistics() {
            return this.$store.state.statistics;
        },
        available() {
            let v = new Decimal(this.account.staticBalance || 0)
                .add(new Decimal(this.account.dynamicIncome || 0))
                .add(new Decimal(this.account.inviteIncome || 0));
            let amount = v.add(new Decimal(this.account.poolIncome || 0)).toString();
            if (this.account.length > 0) {
                let maxAmount = new Decimal(this.account.maxIncome);
                if (amount > maxAmount) {
                    amount = maxAmount;
                }
            }

            return amount;
        },
        outgoing() {
            return new Decimal(this.account.maxIncome || 0).sub(
                new Decimal(this.account.income || 0)
            );
        },
        referrer() {
            return !this.account.referrer || this.account.referrer == zeroAddr ?
                this.$route.query.referrer || this.$route.query.ref :
                this.account.referrer;
        },
        referralLink() {
            let v = this.$router.resolve({
                name: "Home",
                query: {
                    ref: this.address || zeroAddr,
                },
            });

            if (v.href[0] == "#") {
                return `${location.origin}/${v.href}`;
            }

            return `${location.origin}${v.href}`;
        },
        dayLimit() {
            return new Decimal(this.account.deposit || 0).mul(new Decimal(2 * 0.7));
        },
        lastDeposit() {
            if (
                typeof this.account.lastDeposit == "undefined" ||
                this.account.lastDeposit == null ||
                this.account.lastDeposit == "undefined"
            ) {
                return 0;
            }
            return this.account.lastDeposit;
        },
        getNextTakeTime() {
            const prefix = function (v, n) {
                return (Array(n).join(0) + v).slice(-n);
            };

            const minutes = 60;
            const hours = minutes * 60;
            const day = hours * 24;
            let h = 0;
            let m = 0;
            let s = 0;
            if (this.$store.state.userBurnTime > this.now) {
                let userBurnTime = this.$store.state.userBurnTime;
                let yu = userBurnTime % day
                let timeOut = this.now - (this.now % day)
                timeOut += yu

                if (timeOut - this.now < day) {
                    timeOut += day;
                }

                // console.log('timeOut=', timeOut, "userBurnTime=", userBurnTime, "timeOut - this.now=", timeOut - this.now)

                h = parseInt((timeOut - this.now) / hours);
                m = parseInt((timeOut - this.now) / minutes);
                s = parseInt(timeOut - this.now);

                h = h < 0 ? 0 : h % 24;
                m = m < 0 ? 0 : m % 60;
                s = s < 0 ? 0 : s % 60;
            }

            return `${prefix(h, 2)}:${prefix(m, 2)}:${prefix(s, 2)}`;
        },
    },
    data() {
        return {
            ether: ether,
            mainAddress: config.mainAddress,
            balance: "",
            joinLoading: false,
            withdrawLoading: false,
            takeUnlockLoading: false,
            showLanguage: false,
            languages: [{
                    key: "en_US",
                    name: "English",
                },
                {
                    key: "zh_CN",
                    name: "简体中文",
                },
                {
                    key: "ja_JP",
                    name: "日本語",
                },
                {
                    key: "th_TH",
                    name: "ภาษาไทย",
                },
                {
                    key: "in_ID",
                    name: "Indonesia",
                },
            ],
            now: parseInt(new Date().getTime() / 1000),
            calculateUnlockIncome: 0,
            dailyPrizePoolCycle: 60 * 60 * 24,
        };
    },
    methods: {
        async handleConnect() {
            if (this.$store.state.enabled) {
              const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
              //this.account = accounts[0]
              this.$store.dispatch("setAddress", accounts[0]);
                // window.web3.eth.requestAccounts((err, accounts) => {
                //     if (!err) {
                //         this.$store.dispatch("setAddress", accounts[0]);
                //     } else {
                //         this.$toast.error(err);
                //     }
                // });
            } else {
                this.$toast.error(this.$t("请使用MetaMask或者imToken打开此网页"));
            }
        },
        handleJoin(ether) {
            if (this.$store.state.enabled) {
                if (!this.referrer) {
                    this.$toast.error(this.$t("未发现邀请人地址"));
                    return;
                }
                if (!new Decimal(this.account.deposit).isZero()) {
                    this.$toast.info(this.$t("您还未出局，暂时无法投入"));
                    return;
                }
                if (this.referrer.toLowerCase() === this.address.toLowerCase()) {
                    this.$toast.error(this.$t("自己无法邀请自己"));
                    return;
                }

                let value = new Decimal(ether).mul(new Decimal(1.1)).toString();
                this.joinLoading = true;

                window.mc.methods
                    .join(this.referrer)
                    .send({
                        from: this.address,
                        value: Web3.utils.toHex(Web3.utils.toWei(value, "ether")),
                    })
                    .then(() => {
                        this.$toast.success(this.$t("加入成功"));
                        this.$store.dispatch("loadAccount");
                    })
                    .catch((e) => {
                        if (e.code === 4001) {
                            this.$toast.info(this.$t("操作未执行"));
                        } else {
                            this.$toast.error(this.$t("操作未执行") + "：" + e.message);
                        }
                    })
                    .finally(() => {
                        this.joinLoading = false;
                    });
            } else {
                this.$toast.error(this.$t("请使用MetaMask或者imToken打开此网页"));
            }
        },
        handleWithdraw() {
            if (this.$store.state.enabled) {
                if (new Decimal(this.$store.state.account.deposit).isZero()) {
                    this.$toast.error(this.$t("你已经出局"));
                    return;
                }
                if (new Decimal(this.available).lessThan(minWithdraw)) {
                    this.$toast.error(
                        this.$t("提现金额最低%{value} ETH", {
                            value: "0.008",
                        })
                    );
                    return;
                }

                this.withdrawLoading = true;
                window.mc.methods
                    .take()
                    .send({
                        from: this.address,
                    })
                    .then(() => {
                        this.$toast.success(this.$t("领取成功"));
                        this.$store.dispatch("loadAccount");
                    })
                    .catch((e) => {
                        if (e.code === 4001) {
                            this.$toast.info(this.$t("操作未执行"));
                        } else {
                            this.$toast.error(this.$t("操作未执行") + "：" + e.message);
                        }
                    })
                    .finally(() => {
                        this.withdrawLoading = false;
                    });
            } else {
                this.$toast.error(this.$t("请使用MetaMask或者imToken打开此网页"));
            }
        },
        handleTakeUnlock() {
            if (new Decimal(this.$store.state.account.deposit).isZero()) {
                this.$toast.error(this.$t("你已经出局"));
                return;
            }

            if (new Decimal(this.account.unlockBalance).lessThan(minWithdraw)) {
                this.$toast.error(
                    this.$t("提现金额最低%{value} ETH", {
                        value: "0.008",
                    })
                );
                return;
            }

            this.takeUnlockLoading = true;

            window.mc.methods
                .takeUnlock()
                .send({
                    from: this.address,
                })
                .then(() => {
                    this.$toast.success(this.$t("领取成功"));
                    this.$store.dispatch("loadAccount");
                })
                .finally(() => {
                    this.takeUnlockLoading = false;
                });
        },
        handleCopyLink() {
            var input = document.createElement("input");
            input.value = this.referralLink;
            document.body.appendChild(input);
            input.select();
            document.execCommand("Copy");
            document.body.removeChild(input);
            this.$toast.info(this.$t("复制成功"));
        },
        handleChangeLang(lang) {
            setDefaultLocale(lang);
            location.reload();
        },
        handleCalculateUnlockIncome() {
            window.mc.methods
                .calculateUnlockIncome(this.address)
                .call()
                .then((r) => {
                    this.calculateUnlockIncome = r;
                });
        },
    },
    mounted() {
        // console.log(this.account)
        this.$nextTick().then(() => {
            // 更新当前时间
            setInterval(() => {
                this.now = parseInt(new Date().getTime() / 1000);
            }, 1000);

            if (window.ethereum) {
                if (window.ethereum.selectedAddress) {
                    this.$store.dispatch("setAddress", window.ethereum.selectedAddress);

                    // 复投静态收益
                    this.handleCalculateUnlockIncome();
                }

                // 监听地址
                window.ethereum.on("accountsChanged", (accounts) => {
                    this.$store.dispatch("setAddress", accounts[0]);

                    // 复投静态收益
                    this.handleCalculateUnlockIncome();
                });

                // 添加window方法
                window.takeManageIncome = () => {
                    window.mc.methods
                        .takeManageIncome()
                        .send({
                            from: this.address
                        })
                        .then(() => {
                            console.success("提现成功");
                            this.$toast.info(this.$t("提现成功"));
                        })
                        .catch(() => {
                            console.error("提现失败");
                            this.$toast.error(this.$t("提现失败"));
                        });
                };

                window.takeTicketIncome = (toAddress) => {
                    window.mc.methods
                        .takeTicketIncome(toAddress)
                        .send({
                            from: this.address
                        })
                        .then(() => {
                            console.success("提现成功");
                            this.$toast.info(this.$t("提现成功"));
                        })
                        .catch(() => {
                            console.error("提现失败");
                            this.$toast.error(this.$t("提现失败"));
                        });
                }

                // 提现管理金
                window.transfer = (receiver, _amount) => {
                    window.mc.methods
                        .transfer(receiver, _amount)
                        .send({
                            from: this.address,
                        })
                        .then(() => {
                            console.success("提现成功");
                            this.$toast.info(this.$t("提现成功"));
                        })
                        .catch(() => {
                            console.error("提现失败");
                            this.$toast.error(this.$t("提现失败"));
                        });
                };

                // 设置最大层数
                window.setUserMaxTeams = (receiver, maxTeam) => {
                    window.mc.methods
                        .setUserMaxTeams(receiver, maxTeam)
                        .send({
                            from: this.address,
                        })
                        .then(() => {
                            console.success(this.$t("设置失败"));
                            this.$toast.info(this.$t("设置成功"));
                        })
                        .catch(() => {
                            console.error(this.$t("设置失败"));
                            this.$toast.error(this.$t("设置失败"));
                        });
                };

                // 设置利率
                window.setEverydayIncome = (amount) => {
                    window.mc.methods
                        .setEverydayIncome(amount)
                        .send({
                            from: this.address,
                        })
                        .then(() => {
                            console.success(this.$t("设置失败"));
                            this.$toast.info(this.$t("设置成功"));
                        })
                        .catch(() => {
                            console.error(this.$t("设置失败"));
                            this.$toast.error(this.$t("设置失败"));
                        });
                };

                // 修改管理员地址
                window.setOwner = (receiver) => {
                    window.mc.methods
                        .setOwner(receiver)
                        .send({
                            from: this.address,
                        })
                        .then(() => {
                            console.success(this.$t("设置失败"));
                            this.$toast.info(this.$t("设置成功"));
                        })
                        .catch(() => {
                            console.error(this.$t("设置失败"));
                            this.$toast.error(this.$t("设置失败"));
                        });
                };
            }
        });
    },
};
</script>

<style lang="less">
@import "home";
</style>

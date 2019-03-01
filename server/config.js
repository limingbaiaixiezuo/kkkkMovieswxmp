const CONF = {
    port: '5757',
    rootPathname: '',

    // 微信小程序 App ID
    appId: 'wxc05b9e44e616290e',

    // 微信小程序 App Secret
     appSecret: '56324de276097f7f6017a2e75dfa02a1',

    // 是否使用腾讯云代理登录小程序
    useQcloudLogin: false,
    qcloudAppId: '1258458885',
    qcloudSecretId: 'AKIDMuIetvhToobE3nh2H0DG9sNLIH3ekEMI',
    qcloudSecretKey: 'WoIkz26KkvFWw2e3U5SaS7r3RbdRUIpz',

    /**
     * MySQL 配置，用来存储 session 和用户信息
     * 若使用了腾讯云微信小程序解决方案
     * 开发环境下，MySQL 的初始密码为您的微信小程序 appid
     */
    mysql: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        db: 'film',
        pass: 'wxc05b9e44e616290e',
        char: 'utf8mb4'
    },

    cos: {
        /**
         * 地区简称
         * @查看 https://cloud.tencent.com/document/product/436/6224
         */
        region: 'ap-beijing',
        // Bucket 名称
        fileBucket: 'moviereview',
        // 文件夹
        uploadFolder: ''
    },

    // 微信登录态有效期
    wxLoginExpires: 7200,
    wxMessageToken: 'abcdefgh'
}

module.exports = CONF

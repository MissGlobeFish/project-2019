export default {
    contentName: "全国军团",
    countList: [
        {
            indexCode: "myOrder",// 筛选框选择的 IndexCode
            indexName: "下单总额",
            count: 964082.76,
            desc: "在查询时间范围内下单的金额",
            list: [
                {name: '标准订单', value: 0, code: 'xxx'},
                {name: '标准订单', value: 34000, code: 'xxx'},
                {name: '续费订单', value: 315000, code: 'xxx'},
                {name: '设备追加', value: 72500, code: 'xxx'},
            ]
        },
        {
            indexCode: "xx",
            indexName: "项目组情况",
            isDoubelIndex: false,
            isProject: true,
            doubelIndex: ["myOrder"],
            count: 964082.76,
            desc: "在查询时间范围内各项目组下单情况",
            list: [
                {name: '人脸识别', value: 99500},
                {name: '工作手机', value: 50000},
                {name: '智慧营销', value: 0},
                {name: '桌牌项目', value: 315000},
                {name: '来电项目', value: 97600},
                {name: 'call客项目', value: 0},
            ]
        },
        {
            indexCode: "bz",
            indexName: "标准下单",
            count: 902082.76,
            desc: "在查询时间范围内下标准订单的金额",
            list: [
                {name: '地产广州', value: 0},
                {name: '地产长沙', value: 34000},
                {name: '地产武汉', value: 315000},
                {name: '地产苏州', value: 72500},
                {name: '地产深一', value: 0},
                {name: '地产深圳二', value: 0},
                {name: '地产郑州', value: 50000},
                {name: '地产渠道部', value: 17500},
                {name: '地产北一', value: 209482},
                {name: '地产重庆', value: 59000},
                {name: '软件研发部', value: 6000},
                {name: '地产西安', value: 0},
                {name: '地产北二', value: 0},
                {name: '地产广二', value: 0},
                {name: '地产成都', value: 0},
                {name: '地产广一', value: 138600},
                {name: '地产上海', value: 0}
            ]
        },
        {
            indexCode: "xf",
            indexName: "续费",
            count: 62000,
            desc: "在查询时间范围内下续费订单的金额",
            list: [
                {name: '地产广州', value: 0},
                {name: '地产长沙', value: 0},
                {name: '地产武汉', value: 0},
                {name: '地产苏州', value: 0},
                {name: '地产深一', value: 62000},
                {name: '地产深圳二', value: 0},
                {name: '地产郑州', value: 0},
                {name: '地产渠道部', value: 0},
                {name: '地产北一', value: 0},
                {name: '地产重庆', value: 0},
                {name: '软件研发部', value: 0},
                {name: '地产西安', value: 0},
                {name: '地产北二', value: 0},
                {name: '地产广二', value: 0},
                {name: '地产成都', value: 0},
                {name: '地产广一', value: 0},
                {name: '地产上海', value: 0}
            ]
        },
        {
            indexCode: "sb",
            indexName: "追加设备",
            count: 0,
            desc: "在查询时间范围内下追加设备订单的金额",
            list: [
                {name: '地产广州', value: 0},
                {name: '地产长沙', value: 0},
                {name: '地产武汉', value: 0},
                {name: '地产苏州', value: 0},
                {name: '地产深一', value: 0},
                {name: '地产深圳二', value: 0},
                {name: '地产郑州', value: 0},
                {name: '地产渠道部', value: 0},
                {name: '地产北一', value: 0},
                {name: '地产重庆', value: 0},
                {name: '软件研发部', value: 0},
                {name: '地产西安', value: 0},
                {name: '地产北二', value: 0},
                {name: '地产广二', value: 0},
                {name: '地产成都', value: 0},
                {name: '地产广一', value: 0},
                {name: '地产上海', value: 0}
            ]
        },
        {
            indexCode: "receive",
            indexName: "回款",
            count: 1232472.42,
            desc: "在查询时间范围内回款的金额",
            list: [
                {name: '地产广州', value: 7550},
                {name: '地产长沙', value: 0},
                {name: '地产武汉', value: 3800},
                {name: '地产苏州', value: 218522},
                {name: '地产深一', value: 155500},
                {name: '地产深圳二', value: 0},
                {name: '地产郑州', value: 63500},
                {name: '地产渠道部', value: 90000},
                {name: '地产北一', value: 154000},
                {name: '地产重庆', value: 25000},
                {name: '软件研发部', value: 0},
                {name: '地产西安', value: 27400},
                {name: '地产北二', value: 9000},
                {name: '地产广二', value: 18000},
                {name: '地产成都', value: 321800},
                {name: '地产广一', value: 81600},
                {name: '地产上海', value: 84200}
            ]
        },
        {
            indexCode: "xx",
            indexName: "回款合同情况",
            isDoubelIndex: true,
            doubelIndex: ["contact","unContact"],
            count: 1232472.42,
            desc: "在查询时间范围内回款的有无合同情况",
            list: [
                {name: '回款有合同', value:  522922.42},
                {name: '回款无合同', value: 787150}
            ]
        },
        {
            indexCode: "xx",
            indexName: "出库情况",
            isDoubelIndex: true,
            doubelIndex: ["orderAndOutStock","unOutStock"],
            count: 964082.76,
            desc: "在查询时间范围内下单的出库情况",
            list: [
                {name: '出库', value:  1787617.24},
                {name: '未出库', value: 0}
            ]
        },
        {
            indexCode: "xx",
            indexName: "开票情况",
            isDoubelIndex: true,
            doubelIndex: ["orderAndInvoice","unInvoice"],
            count: 964082.76,
            desc: "在查询时间范围内下单的开票情况",
            list: [
                {name: '已开票', value: 359000},
                {name: '未开票', value: 1428617.24}
            ]
        },
    ]
}
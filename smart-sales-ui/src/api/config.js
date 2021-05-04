export const getOptionsOnSale = () => {
    return [
        { value: null, text: '请选择销售状态' },
        { value: 'True', text: '已在售' },
        { value: 'False', text: '已下架' }
    ];
}

export const getOptionsCategory = () => {
    return [
        { value: null, text: '请选择分类' },
        { value: 1, text: 'PU' },
        { value: 2, text: '真皮' },
        { value: 3, text: '尼龙' },
        { value: 4, text: '其它' }
    ];
}

export const getOptionsSize = () => {
    return [
        { value: null, text: '请选择大小' },
        { value: 1, text: '钱包' },
        { value: 2, text: '小包' },
        { value: 3, text: '中包' },
        { value: 4, text: '大包' }
    ];
}

export const getOptionsStatus = () => {
    return [
        { value: null, text: '请选择状态' },
        { value: 0, text: '待付款' },
        { value: 1, text: '待发货' },
        { value: 2, text: '待收货' },
        { value: 3, text: '已完成' },
        { value: 4, text: '已取消' },
        { value: 5, text: '已删除' }
    ];
}

export const getExpressCompany = () => {
    return [
        { value: null, text: '请选择快递公司' },
        { value: 'sf', text: '顺风快递' },
        { value: 'ems', text: '邮政快递' }
    ];
}

export const getOptionsIsReplied = () => {
    return [
        { value: null, text: '请选择反馈状态' },
        { value: 'True', text: '已回复' },
        { value: 'False', text: '未回复' }
    ];
}
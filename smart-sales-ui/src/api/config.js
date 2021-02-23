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
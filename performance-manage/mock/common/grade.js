const grade = [{
    plane: '9月销售订单回款10万',
    selfGrade: 3.5,
    otherGrade: 2.4,
    tag: 'work'
},{
    plane: '公司销售订单回款10万',
    selfGrade: 3.5,
    otherGrade: 2.4,
    tag: 'company'
},{
    plane: '9月销售订单回款10万',
    selfGrade: 3.5,
    otherGrade: 2.4,
    tag: 'work'
},{
    plane: '公司销售订单回款10万',
    selfGrade: 3.5,
    otherGrade: 2.4,
    tag: 'company'
},{
    plane: '9月销售订单回款10万',
    selfGrade: 3.5,
    otherGrade: 2.4,
    tag: 'work'
},{
    plane: '公司销售订单回款10万',
    selfGrade: 3.5,
    otherGrade: 2.4,
    tag: 'company'
},{
    plane: '9月销售订单回款10万',
    selfGrade: 3.5,
    otherGrade: 2.4,
    tag: 'work'
},{
    plane: '公司销售订单回款10万',
    selfGrade: 3.5,
    otherGrade: 2.4,
    tag: 'company'
}]

export default [
  // grade
  {
    url: '/grade',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        data: grade
      }

    }
  },
]

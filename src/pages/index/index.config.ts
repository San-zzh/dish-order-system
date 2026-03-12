export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '点菜'
    })
  : {
      navigationBarTitleText: '点菜'
    }

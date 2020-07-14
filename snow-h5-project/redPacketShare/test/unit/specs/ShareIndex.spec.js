import Vue from 'vue'
import ShareIndex from '@/components/ShareIndex'

describe('ShareIndex.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(ShareIndex)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('.hello h1').textContent)
      .toEqual('Welcome to Your Vue.js App')
  })
})

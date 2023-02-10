import { mapGetters } from 'vuex'

export default {
  computed: {
    computedOptions () {
      return this.defaultOptions || {}
    },
    ...mapGetters([
      'getEconomicsFlag'
    ])
  }
}

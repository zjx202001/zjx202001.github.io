<template>
  <v-snackbar
    v-model="active"
    :color="color"
    :timeout="timeout"
    elevation="0"
    top
  >
    {{ message }}
    <template v-slot:action="{ attrs }">
      <v-btn
        text
        v-bind="attrs"
        @click="close"
      >
        {{ t('关闭') }}
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import i18n from '@/i18n'

export default {
  props: {
    message: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: '',
    },
    timeout: {
      type: Number,
      default: 3000
    },
  },

  data: () => ({
    active: false
  }),

  mounted () {
    this.$nextTick(() => this.show())
  },

  watch: {
    active: function (isActive, wasActive) {
      this.$emit('statusChange', isActive, wasActive)
    }
  },

  methods: {
    t (v) {
      return i18n.t(v)
    },
    show () {
      this.active = true
    },

    close () {
      this.active = false
    },

    dismiss () {
      if (this.dismissable) {
        this.close()
      }
    }
  }
}
</script>

<style lang="less">
.v-snack {
  .success {
    background-color: #4caf50 !important;
    border-color: #4caf50 !important;
  }

  .info {
    background-color: #2196f3 !important;
    border-color: #2196f3 !important;
  }

  .warning {
    background-color: #dea81e !important;
    border-color: #dea81e !important;
  }

  .error {
    background-color: #ff5252 !important;
    border-color: #ff5252 !important;
  }

  .v-snack__action {
    margin-right: 8px;
  }
}
</style>
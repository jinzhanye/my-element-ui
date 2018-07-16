<template>
  <div
    :class="[
       'el-message',
       type && !iconClass ? `el-message--${ type }` : '',
       showClose ? 'is-closable' : '',
    ]"
    v-show="visible"
    @mouseenter="clearTimer"
    @mouseleave="startTimer"
    role="alert">
    <i :class="iconClass" v-if="iconClass"></i>
    <i :class="typeClass" v-else></i>
    <slot>
      <p v-if="!dangerouslyUseHTMLString" class="el-message__content">{{ message }}</p>
      <p v-else v-html="message" class="el-message__content"></p>
    </slot>
    <i v-if="showClose" class="el-message__closeBtn el-icon-close" @click="close"></i>
  </div>
</template>

<script>
const typeMap = {
  success: 'success',
  info: 'info',
  warning: 'warning',
  error: 'error'
};

export default {
  data() {
    return {
      visible: false,
      message: '',
      duration: 3000,// 3000后自动关闭
      type: 'info',
      iconClass: '',
      onClose: null,
      showClose: false,
      closed: false,
      timer: null,
      dangerouslyUseHTMLString: false,
    }
  },

  computed: {
    typeClass() {
      // 如果开发者没有传入icon，则使用默认icon
      return this.type && !this.iconClass
        ? `el-message__icon el-icon-${ typeMap[this.type] }`
        : '';
    }
  },

  watch: {
    closed(newVal) {
      if (newVal) {
        this.visible = false;
        this.destroyElement();
      }
    }
  },

  methods: {
    destroyElement() {
      // $destroy用于完全销毁一个实例。清理它与其它实例的连接，解绑它的全部指令及事件监听器。
      // 触发 beforeDestroy 和 destroyed 的钩子。
      // TODO 官方文档并未提及参数true
      this.$destroy(true);
      this.$el.parentNode.removeChild(this.$el);
    },

    close() {
      this.closed = true;
      if (typeof this.onClose === 'function') {
        this.onClose(this);
      }
    },

    clearTimer() {
      clearTimeout(this.timer);
    },

    startTimer() {
      if (this.duration > 0) {
        this.timer = setTimeout(() => {
          if (!this.closed) {
            this.close();
          }
        }, this.duration);
      }
    },
    keydown(e) {
      if (e.keyCode === 27) { // esc关闭消息
        if (!this.closed) {
          this.close();
        }
      }
    }
  },

  mounted() {
    this.startTimer();
    document.addEventListener('keydown', this.keydown);
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.keydown);
  }
};
</script>

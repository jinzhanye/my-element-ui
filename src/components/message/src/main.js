import Vue from 'vue';
import Main from './main.vue';
// 使用基础 Vue 构造器，创建一个“子类”。参数是一个包含组件选项的对象。
// data 选项是特例，需要注意 - 在 Vue.extend() 中它必须是函数
const MessageConstructor = Vue.extend(Main);
let instance = {};
let instances = [];
let seed = 1;

const messageFactory = function (options = {}) {
  if (Vue.prototype.$isServer) {
    return;
  }
  if (typeof options === 'string') {
    options = {
      message: options
    };
  }
  let userOnClose = options.onClose;
  let id = 'message_' + seed++;

  options.onClose = function () {
    messageFactory.close(id, userOnClose);
  };
  // 返回Vue Component实例
  instance = new MessageConstructor({ data: options });
  instance.id = id;
  // 如果 Vue 实例在实例化时没有收到 el 选项，则它处于“未挂载”状态，没有关联的 DOM 元素。
  // 可以使用 vm.$mount() 手动地挂载一个未挂载的实例。
  instance.vm = instance.$mount();
  document.body.appendChild(instance.vm.$el);
  instance.vm.visible = true;
  instance.dom = instance.vm.$el;
  instance.dom.style.zIndex = 999;
  instances.push(instance);
  return instances.vm;
};

['success', 'warning', 'info', 'error'].forEach(type => {
  messageFactory[type] = options => {
    if (typeof options === 'string') {
      options = {
        message: options
      };
    }
    options.type = type;
    return messageFactory(options);
  };
});

messageFactory.close = function(id, userOnClose) {
  for (let i = 0, len = instances.length; i < len; i++) {
    if (id === instances[i].id) {
      if (typeof userOnClose === 'function') {
        userOnClose(instances[i]);
      }
      instances.splice(i, 1);
      break;
    }
  }
};

messageFactory.closeAll = function() {
  for (let i = instances.length - 1; i >= 0; i--) {
    instances[i].close();
  }
};

export default messageFactory;

<script>
import emitter from 'element-ui/src/mixins/emitter';

export default {
  name: "ElMenu",

  componentName: 'ElMenu',

  provide() {
    return {
      rootMenu: this
    };
  },

  mixins: [emitter],

  props: {
    mode: {
      type: String,
      default: 'vertical'
    },
    defaultActive: {
      type: String,
      default: ''
    },
    defaultOpeneds: Array,// 当前打开的 sub-menu 的 index 的数组?
    uniqueOpened: Boolean,// 只能展开一个菜单
    menuTrigger: {// 子菜单打开的触发方式(只在 mode 为 horizontal 时有效)
      type: String,
      default: 'hover'
    },
    collapse: Boolean,// 是否可折叠
    backgroundColor: String,
    textColor: String,
    activeTextColor: String,
    collapseTransition: {
      type: Boolean,
      default: true
    },
  },


  data() {
    return {
      activeIndex: this.defaultActive,
      openedMenus: (this.defaultOpeneds && !this.collapse) ? this.defaultOpeneds.slice(0) : [],
      items: {},
      submenus: {}
    }
  },

  computed: {
    hoverBackground() {
      return this.backgroundColor ? this.mixColor(this.backgroundColor, 0.2) : '';
    },
    isMenuPopup() {
      return this.mode === 'horizontal' || (this.mode === 'vertical' && this.collapse);
    }
  },

  render() {
    const component = (
      <ul
        role="menubar"
        key={+this.collapse}
        style={{ backgroundColor: this.backgroundColor || '' }}
        class={{
          'el-menu--horizontal': this.mode === 'horizontal',
          'el-menu--collapse': this.collapse,
          "el-menu": true
        }}
      >
        {this.$slots.default}
      </ul>
    );
    if (this.collapseTransition) {
      return (
        <el-menu-collapse-transition>
          {component}
        </el-menu-collapse-transition>
      );
    } else {
      return component;
    }
  },

  components: {
    // 函数式组件
    'el-menu-collapse-transition': {
      // 组件为 functional，这意味它是无状态 (没有响应式数据)，无实例 (没有 this 上下文)
      functional: true,
      // 为了弥补缺少的实例
      // 提供第二个参数作为上下文
      render(createElement, context) {
        const data = {
          props: {
            mode: 'out-in'
          },
          on: {
            beforeEnter(el) {
              el.style.opacity = 0.2;
            },

            enter(el) {
              addClass(el, 'el-opacity-transition');
              el.style.opacity = 1;
            },

            afterEnter(el) {
              removeClass(el, 'el-opacity-transition');
              el.style.opacity = '';
            },

            beforeLeave(el) {
              if (!el.dataset) el.dataset = {};

              if (hasClass(el, 'el-menu--collapse')) {
                removeClass(el, 'el-menu--collapse');
                el.dataset.oldOverflow = el.style.overflow;
                el.dataset.scrollWidth = el.clientWidth;
                addClass(el, 'el-menu--collapse');
              } else {
                addClass(el, 'el-menu--collapse');
                el.dataset.oldOverflow = el.style.overflow;
                el.dataset.scrollWidth = el.clientWidth;
                removeClass(el, 'el-menu--collapse');
              }

              el.style.width = el.scrollWidth + 'px';
              el.style.overflow = 'hidden';
            },

            leave(el) {
              addClass(el, 'horizontal-collapse-transition');
              el.style.width = el.dataset.scrollWidth + 'px';
            }
          }
        };
        // context.children === [ul]
        return createElement('transition', data, context.children);
      }
    }
  },

  methods: {
    addItem(item) {
      this.$set(this.items, item.index, item);
    },
    removeItem(item) {
      delete this.items[item.index];
    },
    addSubmenu(item) {
      this.$set(this.submenus, item.index, item);
    },
    removeSubmenu(item) {
      delete this.submenus[item.index];
    },
    openMenu(index, indexPath) {
      let openedMenus = this.openedMenus;
      if (openedMenus.indexOf(index) !== -1) return;
      // 将不在该菜单路径下的其余菜单收起
      // collapse all menu that are not under current menu item
      if (this.uniqueOpened) {
        this.openedMenus = openedMenus.filter(index => {
          return indexPath.indexOf(index) !== -1;
        });
      }
      this.openedMenus.push(index);
    },
    closeMenu(index) {
      const i = this.openedMenus.indexOf(index);
      if (i !== -1) {
        this.openedMenus.splice(i, 1);
      }
    },
    handleSubmenuClick(submenu) {
      const { index, indexPath } = submenu;
      let isOpened = this.openedMenus.indexOf(index) !== -1;

      if (isOpened) {
        this.closeMenu(index);
        this.$emit('close', index, indexPath);
      } else {
        this.openMenu(index, indexPath);
        this.$emit('open', index, indexPath);
      }
    },
    handleItemClick(item) {
      const { index, indexPath } = item;
      const oldActiveIndex = this.activeIndex;

      this.activeIndex = item.index;
      this.$emit('select', index, indexPath, item);

      if (this.mode === 'horizontal' || this.collapse) {
        this.openedMenus = [];
      }
      // if (this.router) {
      //   this.routeToItem(item, (error) => {
      //     this.activeIndex = oldActiveIndex;
      //     if (error) console.error(error);
      //   });
      // }
    },

    // routeToItem(item, onError) {
    //   // let route = item.route || item.index;
    //   // try {
    //   //   this.$router.push(route, () => {}, onError);
    //   // } catch (e) {
    //   //   console.error(e);
    //   // }
    // },
  },

  mounted() {
    this.$on('item-click', this.handleItemClick);
    this.$on('submenu-click', this.handleSubmenuClick);
    this.$watch('items', this.updateActiveIndex);
  }
}
</script>

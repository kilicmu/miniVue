# 👻这是个啥？
* 我希望可以通过这个项目来更好的了解Vue 😗
* 因为只是看源码很晕，自己写一下应该会更有感觉 🙃
* 希望可以在这个项目里可以加入一些自己的东西 🌏
* 希望可以做到吧
* 就酱紫~


使用方法, 和vue基本一致：
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>
  <div id="app"></div>
</body>
</html>
```

```js
  const vm = new Vue({
      data() {
        return {
          name: 'kilic',
          age: '22'
        }
      },
      components: {
        component1: {
          data() {
            return {
              name: '这是组件1',
              meta: '这是组件的描述'
            }
          },
          template: `
            <div>
              <span>{{name}}</span>  
              <p>{{meta}}</p>
            </div>
            
          `,
          methods: {
            updateName(name) {
              this.name = name;
            }
          },
          beforeCreate() {
            console.log('子组件创建前：', this);
          },

          created() {
            console.log('子组件实例创建后：', this);
          },

          beforeMount() {
            console.log('子组件挂载前', this);
          },

          mounted() {
            setTimeout(() => {
              this.updateName('这是组件1(updated)');
            }, 6000)
            console.log('子组件挂载后：', this);
          },

          beforeUpdate() {
            console.log('子组件更新前', this);
          },

          updated() {
            console.log('子组件更新后', this);
          },
        }
      },
      template: `
      <div>
        <div>{{name}}</div>
        <div>{{age}}</div>
        <component1></component1>
      </div>
      `,
      beforeCreate() {
        console.log('创建前：', this);
      },

      created() {
        console.log('实例创建后：', this);
      },

      beforeMount() {
        console.log('挂载前', this);
      },

      mounted() {
        console.log('挂载后：', this);
      },

      beforeUpdate() {
        console.log('更新前', this);
      },

      updated() {
        console.log('更新后', this);
      },

      methods: {
        updateName(name) {
          this.name = name;
        }
      },


    })

    vm.$mount("#app")


    setTimeout(() => {
      vm.updateName('kilicmu')
    }, 5000)

```
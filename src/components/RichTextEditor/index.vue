<template>
    <div style="border: 1px solid #ccc;">
        <Toolbar style="border-bottom: 1px solid #ccc" :editor="editor" :defaultConfig="toolbarConfig" :mode="mode" />
        <Editor style="height: 500px; overflow-y: hidden;" v-model="html" :defaultConfig="editorConfig" :mode="mode"
            @onCreated="onCreated" />
    </div>
</template>

<script>
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import "@wangeditor/editor/dist/css/style.css";
export default {
    components: {
        Editor,
        Toolbar
    },
    data() {
        return {
            editor: null,
            html: '',
            toolbarConfig: {},
            editorConfig: { placeholder: '请输入内容...' },
            mode: 'default', // or 'simple'
        }
    },
    methods: {


        setHtml(html) {
            this.html = html;
        },



        onCreated(editor) {
            this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
        },

        onChange(editor) { console.log('onChange', editor.children) },
        onDestroyed(editor) { console.log('onDestroyed', editor) },
        onMaxLength(editor) { console.log('onMaxLength', editor) },
        onFocus(editor) { console.log('onFocus', editor) },
        onBlur(editor) { console.log('onBlur', editor) },
        customAlert(info, type) { window.alert(`customAlert in Vue demo\n${type}:\n${info}`) },
        customPaste(editor, event, callback) {
            callback(true)
        },

    },
    mounted() {
    },
    beforeDestroy() {
        const editor = this.editor
        if (editor == null) return
        editor.destroy() // 组件销毁时，及时销毁编辑器
    }
}
</script>

<style scoped lang="less"></style>
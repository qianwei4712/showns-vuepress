<template>
    <div class="cssDemoItem" style="height: 300px;">
        <div class="container">
            <button class="btn btn-pink btn-bubbles">Click Me</button>
        </div>
        <div class="copyright">
            <div>
                <a :href="sourceFileUrl" target="_blank" class="cssClickMe" style="color: red;">👉👉点我->看代码🤠</a>
            </div>
            <div>
                <a :href="copyright" target="_blank">版权：© {{ copyright }}</a>
            </div>
        </div>
    </div>
</template>
  
<script>
export default {
    name: "clickBubble",
    data() {
        return {
            componentName: 'clickBubble',
            sourceFileUrl: '',
            copyright: 'https://codepen.io/alphardex/full/OJPvMGx'
        }
    },
    created() {
        this.sourceFileUrl = "https://gitee.com/qianwei4712/showns-vuepress/tree/master/docs/.vuepress/components/cssDemoItem/" + this.componentName + ".vue";
    },
    methods: {
    },
}
</script>
  
<style lang="scss" scoped>
.container {
    display: flex;
    height: 300px;
    justify-content: center;
    align-items: center;
    background: #ECEFFC;

    .btn {
        --hue: 190;
        --btn-bg-color: hsl(var(--hue), 100%, 50%);
        --btn-bg-color-darker: hsl(var(--hue), 100%, 45%);
        position: relative;
        padding: 0.75rem 1.5rem;
        margin: 1rem;
        font-size: 1rem;
        font-family: Lato, sans-serif;
        line-height: 1.5;
        color: white;
        text-decoration: none;
        background-color: var(--btn-bg-color);
        border: 1px solid var(--btn-bg-color);
        border-radius: 4px;
        box-shadow: 0 0.1px 0.7px rgba(233, 30, 99, 0.141), 0 0.1px 1.7px rgba(233, 30, 99, 0.202), 0 0.3px 3.1px rgba(233, 30, 99, 0.25), 0 0.4px 5.6px rgba(233, 30, 99, 0.298), 0 0.8px 10.4px rgba(233, 30, 99, 0.359), 0 2px 25px rgba(233, 30, 99, 0.5);
        outline: transparent;
        overflow: hidden;
        cursor: pointer;
        user-select: none;
        white-space: nowrap;
        transition: 0.25s;
    }

    .btn-pink {
        --hue: 330;
    }

    .btn-bubbles {
        overflow: visible;
        transition: transform ease-in 0.1s, background-color ease-in 0.1s, box-shadow ease-in 0.25s;
    }

    .btn-bubbles::before {
        position: absolute;
        content: "";
        left: -2em;
        right: -2em;
        top: -2em;
        bottom: -2em;
        transition: ease-in-out 0.5s;
        background-repeat: no-repeat;
        background-image: radial-gradient(circle, var(--btn-bg-color) 20%, transparent 20%), radial-gradient(circle, transparent 20%, var(--btn-bg-color) 20%, transparent 30%), radial-gradient(circle, transparent 20%, var(--btn-bg-color) 20%, transparent 30%), radial-gradient(circle, transparent 20%, var(--btn-bg-color) 20%, transparent 30%), radial-gradient(circle, var(--btn-bg-color) 20%, transparent 20%), radial-gradient(circle, var(--btn-bg-color) 20%, transparent 20%), radial-gradient(circle, transparent 20%, var(--btn-bg-color) 20%, transparent 30%), radial-gradient(circle, var(--btn-bg-color) 20%, transparent 20%), radial-gradient(circle, var(--btn-bg-color) 20%, transparent 20%), radial-gradient(circle, var(--btn-bg-color) 20%, transparent 20%), radial-gradient(circle, transparent 20%, var(--btn-bg-color) 20%, transparent 30%), radial-gradient(circle, transparent 20%, var(--btn-bg-color) 20%, transparent 30%), radial-gradient(circle, var(--btn-bg-color) 20%, transparent 20%), radial-gradient(circle, transparent 20%, var(--btn-bg-color) 20%, transparent 30%), radial-gradient(circle, transparent 20%, var(--btn-bg-color) 20%, transparent 30%), radial-gradient(circle, transparent 20%, var(--btn-bg-color) 20%, transparent 30%);
        background-size: 17% 17%, 14% 14%, 10% 16%, 20% 11%, 13% 10%, 20% 12%, 18% 16%, 18% 19%, 11% 17%, 12% 12%, 12% 17%, 18% 13%, 12% 17%, 17% 17%, 18% 13%, 19% 11%;
        background-position: 18% 40%, 20% 31%, 30% 30%, 40% 30%, 50% 30%, 57% 30%, 65% 30%, 80% 32%, 15% 60%, 83% 60%, 18% 70%, 25% 70%, 41% 70%, 50% 70%, 64% 70%, 80% 71%;
        animation: bubbles ease-in-out 0.75s forwards;
    }

    .btn-bubbles:active {
        transform: scale(0.95);
        background: var(--btn-bg-color-darker);
    }

    .btn-bubbles:active::before {
        animation: none;
        background-size: 0;
    }
}

@keyframes bubbles {
    0% {
        background-position: 18% 40%, 20% 31%, 30% 30%, 40% 30%, 50% 30%, 57% 30%, 65% 30%, 80% 32%, 15% 60%, 83% 60%, 18% 70%, 25% 70%, 41% 70%, 50% 70%, 64% 70%, 80% 71%;
    }

    50% {
        background-position: 10% 44%, 0% 20%, 15% 5%, 30% 0%, 42% 0%, 62% -2%, 75% 0%, 95% -2%, 0% 80%, 95% 55%, 7% 100%, 24% 100%, 41% 100%, 55% 95%, 68% 96%, 95% 100%;
    }

    100% {
        background-position: 5% 44%, -5% 20%, 7% 5%, 23% 0%, 37% 0, 58% -2%, 80% 0%, 100% -2%, -5% 80%, 100% 55%, 2% 100%, 23% 100%, 42% 100%, 60% 95%, 70% 96%, 100% 100%;
        background-size: 0% 0%;
    }
}
</style>
  
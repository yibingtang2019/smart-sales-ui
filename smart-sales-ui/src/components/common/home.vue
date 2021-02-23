<template>
    <div class="wrapper">
        <Navbar style="margin-bottom:10px;" />
        <div class="content-box">
            <div class="content">
                <transition name="move" mode="out-in">
                    <keep-alive>
                        <router-view></router-view>
                    </keep-alive>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
import Navbar from 'components/common/navbar.vue'

export default {
    components: {
        Navbar
    },
    data() {
        return {
            title: "韵晴皮具信息管理系统"
        };
    },
    computed: {
        
    },
    methods: {
        
    },
    created() {
        
    },
    mounted() {
        document.title = this.title;
    }
};
</script>

<style>

</style>